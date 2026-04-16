import { makeAutoObservable, runInAction } from "mobx";

import { PAGES } from "@/shared/config/pages.config";
import {
  canAccessRoute as rbacCanAccessRoute,
  getAppRoleFromSessionUser,
  getFallbackPathForRole,
  normalizeRoleCandidate,
} from "@/shared/config/roles.config";
import type { RootStore } from "@/shared/store";

import { AuthRepository } from "./repository";

import type { AuthMeResponse, AuthSession, AuthUser, UserRole } from "./model";

export class AuthStore {
  session: AuthSession | null = null;
  isHydrated = false;
  isLoading = false;
  error: string | null = null;

  private readonly repository = new AuthRepository();

  constructor(private readonly _root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentUser(): AuthUser | null {
    return this.session?.user ?? null;
  }

  get isAuthorized(): boolean {
    return Boolean(this.currentUser);
  }

  hydrateSession(): void {
    if (this.isHydrated) {
      return;
    }

    void this.applySessionResponse(this.repository.fetchSession());
  }

  /**
   * Повторная проверка сессии по cookies (например, cookies очищены в DevTools).
   * В отличие от hydrateSession, всегда ходит на `/api/auth/session` и синхронизирует стор с сервером.
   */
  refetchSession(): void {
    void this.applySessionResponse(this.repository.fetchSession());
  }

  private async applySessionResponse(
    promise: Promise<{ user: AuthMeResponse | null }>,
  ): Promise<void> {
    try {
      const data = await promise;

      runInAction(() => {
        const user = data.user;

        if (!user) {
          this.session = null;
        } else {
          this.session = {
            user: this.mapUserFromMe(user),
          };
        }

        this.isHydrated = true;
      });
    } catch {
      runInAction(() => {
        this.session = null;
        this.isHydrated = true;
      });
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      const { user } = await this.repository.login({ email, password });

      runInAction(() => {
        this.session = {
          user: this.mapUserFromMe(user),
        };
        this.isLoading = false;
      });

      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Не удалось выполнить вход";
        this.isLoading = false;
      });

      return false;
    }
  }

  async logout(): Promise<void> {
    await this.repository.logout();

    runInAction(() => {
      this.session = null;
      this.error = null;
    });
  }

  /**
   * Доступ к маршруту с учётом роли и приостановки пространства.
   * Публичные пути проверяются снаружи (AuthGuard / middleware).
   */
  canAccessRoute(pathname: string): boolean {
    const user = this.currentUser;

    if (!user) {
      return false;
    }

    if (user.workspaceSuspended) {
      return pathname === PAGES.SUBSCRIPTION_PAUSED;
    }

    const role = getAppRoleFromSessionUser(user);

    return rbacCanAccessRoute(role, pathname);
  }

  /** Куда вести после логина или при отказе в доступе к текущему URL. */
  getDefaultLandingPath(): string {
    const user = this.currentUser;

    if (!user) {
      return PAGES.HOME;
    }

    if (user.workspaceSuspended) {
      return PAGES.SUBSCRIPTION_PAUSED;
    }

    return getFallbackPathForRole(getAppRoleFromSessionUser(user));
  }

  /** Редирект при RBAC-отказе (доступная страница или 403). */
  resolveForbiddenRedirect(currentPath: string): string {
    const user = this.currentUser;

    if (!user) {
      return PAGES.LOGIN;
    }

    if (user.workspaceSuspended) {
      return PAGES.SUBSCRIPTION_PAUSED;
    }

    const role = getAppRoleFromSessionUser(user);
    const fallback = getFallbackPathForRole(role);

    if (fallback !== currentPath && rbacCanAccessRoute(role, fallback)) {
      return fallback;
    }

    return PAGES.FORBIDDEN;
  }

  private mapUserFromMe(me: AuthMeResponse): AuthUser {
    const roleCandidate = String(me.role ?? "");
    const role: UserRole = normalizeRoleCandidate(roleCandidate);

    const resolvedName = [me.full_name, me.name]
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .find((v) => v.length > 0);

    return {
      id: String(me.id ?? me.user_id ?? "unknown"),
      email: String(me.email ?? ""),
      name: resolvedName ?? "",
      role,
      workspaceSuspended: Boolean(me.workspace_suspended),
    };
  }
}
