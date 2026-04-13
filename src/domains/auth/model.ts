import type { SessionRole } from "@/shared/config/roles.config";

export type UserRole = SessionRole;
export type BackendAuthRole =
  | "CANDIDATE"
  | "COMPANY USER"
  | "COMPANY ADMIN"
  | "SUPER ADMIN"
  | "UNREG";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  /** Пространство приостановлено — блокируем весь продукт, кроме экрана паузы. */
  workspaceSuspended?: boolean;
};

export type AuthSession = {
  user: AuthUser;
};

export type AuthMeResponse = {
  id?: string | number;
  user_id?: string | number;
  email?: string;
  full_name?: string;
  name?: string;
  role?: BackendAuthRole | string;
  workspace_suspended?: boolean;
};
