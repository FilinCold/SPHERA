import { AUTH_SESSION_API_PATH } from "@/shared/config/auth-routes.config";

import type { AuthMeResponse } from "./model";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  user: AuthMeResponse;
};

type SessionResponse = {
  user: AuthMeResponse | null;
};

const jsonHeaders = { "Content-Type": "application/json" };

export class AuthRepository {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { message?: string } | null;

      throw new Error(err?.message ?? "Не удалось выполнить вход");
    }

    return res.json() as Promise<LoginResponse>;
  }

  async fetchSession(): Promise<SessionResponse> {
    const res = await fetch(AUTH_SESSION_API_PATH, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return { user: null };
    }

    return res.json() as Promise<SessionResponse>;
  }

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  }
}
