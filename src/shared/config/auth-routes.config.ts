import { PAGES } from "./pages.config";

/** Внутренний GET для проверки сессии (middleware → BFF → upstream). */
export const AUTH_SESSION_API_PATH = "/api/auth/session";

/** Пути без сессии (middleware пропускает без cookies). */
export const PUBLIC_ROUTE_PATHNAMES: readonly string[] = [
  PAGES.LOGIN,
  PAGES.REGISTRATION,
  PAGES.FORBIDDEN,
  PAGES.SUBSCRIPTION_PAUSED,
];

export const isPublicRoutePathname = (pathname: string): boolean =>
  PUBLIC_ROUTE_PATHNAMES.includes(pathname);

export const isApiRoutePathname = (pathname: string): boolean => pathname.startsWith("/api");

/**
 * Безопасный внутренний путь после логина из query `next`.
 * Только same-origin относительные URL, без open redirect.
 */
export const getSafeInternalPath = (next: string | null): string | null => {
  if (!next?.trim()) {
    return null;
  }

  let decoded = next.trim();

  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return null;
  }

  if (decoded.includes("://") || decoded.startsWith("//")) {
    return null;
  }

  if (!decoded.startsWith("/")) {
    return null;
  }

  if (decoded.startsWith("/api")) {
    return null;
  }

  const pathPart = decoded.split(/[?#]/)[0] ?? "";

  if (pathPart.includes("..")) {
    return null;
  }

  return decoded;
};
