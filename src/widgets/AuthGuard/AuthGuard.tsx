"use client";

import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

import { getSafeInternalPath, isPublicRoutePathname } from "@/shared/config/auth-routes.config";
import { PAGES } from "@/shared/config/pages.config";
import { useStores } from "@/shared/store";

import styles from "./AuthGuard.module.scss";

import type { PropsWithChildren } from "react";

const AuthShellLoading = () => (
  <main className="app-shell" aria-busy="true" aria-live="polite">
    <p className={styles.authGuardLoading}>Загрузка…</p>
  </main>
);

const AuthGuardView = ({ children }: PropsWithChildren) => {
  const { auth } = useStores();
  const pathname = usePathname();
  const router = useRouter();
  const isHydrated = auth.isHydrated;
  const isAuthorized = auth.isAuthorized;
  const isWorkspaceSuspended = Boolean(auth.currentUser?.workspaceSuspended);
  const canAccessCurrentRoute = auth.canAccessRoute(pathname);
  const isPublic = isPublicRoutePathname(pathname);

  useEffect(() => {
    auth.hydrateSession();
  }, [auth]);

  /**
   * Cookies могут исчезнуть вне приложения (DevTools, другая вкладка).
   * Тогда middleware уводит на `/login`, а MobX-стор ещё держит старого пользователя — шапка остаётся «авторизованной».
   * На странице логина при несоответствии пересинхронизируемся с `/api/auth/session`.
   */
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (pathname !== PAGES.LOGIN) {
      return;
    }

    auth.refetchSession();
  }, [auth, isHydrated, pathname]);

  useLayoutEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthorized && !isPublic) {
      const loginUrl = new URL(PAGES.LOGIN, window.location.origin);
      const returnTo = `${pathname}${window.location.search}`;

      if (getSafeInternalPath(returnTo)) {
        loginUrl.searchParams.set("next", returnTo);
      }

      router.replace(`${loginUrl.pathname}${loginUrl.search}`);

      return;
    }

    if (isAuthorized && isPublic) {
      if (pathname === PAGES.SUBSCRIPTION_PAUSED) {
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const target = getSafeInternalPath(params.get("next")) ?? auth.getDefaultLandingPath();

      router.replace(target);

      return;
    }

    if (isAuthorized && !isPublic && isWorkspaceSuspended) {
      if (pathname !== PAGES.SUBSCRIPTION_PAUSED) {
        router.replace(PAGES.SUBSCRIPTION_PAUSED);
      }

      return;
    }

    if (isAuthorized && !isPublic && !canAccessCurrentRoute) {
      router.replace(auth.resolveForbiddenRedirect(pathname));
    }
  }, [
    auth,
    canAccessCurrentRoute,
    isAuthorized,
    isHydrated,
    isPublic,
    isWorkspaceSuspended,
    pathname,
    router,
  ]);

  if (!isHydrated && !isPublic) {
    return <AuthShellLoading />;
  }

  if (isHydrated && !isPublic) {
    if (!isAuthorized) {
      return <AuthShellLoading />;
    }

    if (isWorkspaceSuspended && pathname !== PAGES.SUBSCRIPTION_PAUSED) {
      return <AuthShellLoading />;
    }

    if (!canAccessCurrentRoute) {
      return <AuthShellLoading />;
    }
  }

  return <>{children}</>;
};

export const AuthGuard = observer(AuthGuardView);
