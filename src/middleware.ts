import { NextResponse } from "next/server";

import { clearAuthCookies } from "@/server/bff-cookies";
import {
  AUTH_SESSION_API_PATH,
  getSafeInternalPath,
  isApiRoutePathname,
  isPublicRoutePathname,
} from "@/shared/config/auth-routes.config";
import { PAGES } from "@/shared/config/pages.config";
import { getFallbackPathForRole, normalizeRoleCandidate } from "@/shared/config/roles.config";

import type { NextRequest } from "next/server";

const isWorkspaceSuspended = (user: unknown): boolean => {
  if (!user || typeof user !== "object") {
    return false;
  }

  return Boolean((user as { workspace_suspended?: boolean }).workspace_suspended);
};

const resolveRootRedirectPath = (user: unknown): string => {
  if (!user || typeof user !== "object") {
    return PAGES.LOGIN;
  }

  const roleCandidate = String((user as { role?: string }).role ?? "");
  const role = normalizeRoleCandidate(roleCandidate);

  return getFallbackPathForRole(role === "unrecognized" ? "guest" : role);
};

const forwardSetCookies = (from: Response, to: NextResponse): void => {
  const cookies = from.headers.getSetCookie?.() ?? [];

  for (const cookie of cookies) {
    to.headers.append("Set-Cookie", cookie);
  }
};

const redirectToLogin = (request: NextRequest, pathname: string): NextResponse => {
  const loginUrl = new URL(PAGES.LOGIN, request.url);
  const returnTo = `${pathname}${request.nextUrl.search}`;

  if (getSafeInternalPath(returnTo)) {
    loginUrl.searchParams.set("next", returnTo);
  }

  return NextResponse.redirect(loginUrl);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isApiRoutePathname(pathname)) {
    return NextResponse.next();
  }

  if (isPublicRoutePathname(pathname)) {
    return NextResponse.next();
  }

  const sessionUrl = new URL(AUTH_SESSION_API_PATH, request.url);

  let sessionRes: Response;

  try {
    sessionRes = await fetch(sessionUrl, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });
  } catch {
    const redirect = redirectToLogin(request, pathname);

    clearAuthCookies(redirect);

    return redirect;
  }

  if (!sessionRes.ok) {
    const redirect = redirectToLogin(request, pathname);

    clearAuthCookies(redirect);

    return redirect;
  }

  let data: { user?: unknown };

  try {
    data = (await sessionRes.json()) as { user?: unknown };
  } catch {
    const redirect = redirectToLogin(request, pathname);

    clearAuthCookies(redirect);

    return redirect;
  }

  if (data.user === null || data.user === undefined) {
    const redirect = redirectToLogin(request, pathname);

    forwardSetCookies(sessionRes, redirect);

    return redirect;
  }

  if (isWorkspaceSuspended(data.user) && pathname !== PAGES.SUBSCRIPTION_PAUSED) {
    const pausedUrl = new URL(PAGES.SUBSCRIPTION_PAUSED, request.url);
    const redirect = NextResponse.redirect(pausedUrl);

    forwardSetCookies(sessionRes, redirect);

    return redirect;
  }

  if (pathname === PAGES.HOME) {
    const targetPath = resolveRootRedirectPath(data.user);

    if (targetPath !== pathname) {
      const targetUrl = new URL(targetPath, request.url);
      const redirect = NextResponse.redirect(targetUrl);

      forwardSetCookies(sessionRes, redirect);

      return redirect;
    }
  }

  const response = NextResponse.next();

  forwardSetCookies(sessionRes, response);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
