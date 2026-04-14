import { BFF_COOKIE_ACCESS, BFF_COOKIE_REFRESH } from "@/shared/config/bff-session.constants";

import type { NextResponse } from "next/server";

export { BFF_COOKIE_ACCESS, BFF_COOKIE_REFRESH };

const ACCESS_MAX_AGE = 60 * 15;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

const cookieBase = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
});

export const applyAuthCookies = (
  response: NextResponse,
  tokens: { access: string; refresh?: string },
): void => {
  response.cookies.set(BFF_COOKIE_ACCESS, tokens.access, {
    ...cookieBase(),
    maxAge: ACCESS_MAX_AGE,
  });

  if (tokens.refresh) {
    response.cookies.set(BFF_COOKIE_REFRESH, tokens.refresh, {
      ...cookieBase(),
      maxAge: REFRESH_MAX_AGE,
    });
  }
};

export const clearAuthCookies = (response: NextResponse): void => {
  response.cookies.set(BFF_COOKIE_ACCESS, "", { ...cookieBase(), maxAge: 0 });
  response.cookies.set(BFF_COOKIE_REFRESH, "", { ...cookieBase(), maxAge: 0 });
};
