import { NextResponse } from "next/server";

import {
  BFF_COOKIE_ACCESS,
  BFF_COOKIE_REFRESH,
  applyAuthCookies,
  clearAuthCookies,
} from "@/server/bff-cookies";
import { fetchMeUpstream, refreshUpstream } from "@/server/bff-upstream-auth";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const access = request.cookies.get(BFF_COOKIE_ACCESS)?.value ?? null;
  const refresh = request.cookies.get(BFF_COOKIE_REFRESH)?.value ?? null;

  const ensureAccess = async (): Promise<{
    access: string;
    rotated?: { access: string; refresh?: string };
  } | null> => {
    if (access) {
      return { access };
    }

    if (!refresh) {
      return null;
    }

    const rotated = await refreshUpstream(refresh);

    if (!rotated) {
      return null;
    }

    return { access: rotated.access, rotated };
  };

  const session = await ensureAccess();

  if (!session) {
    const response = NextResponse.json({ user: null });

    clearAuthCookies(response);

    return response;
  }

  let meRes = await fetchMeUpstream(session.access);
  let rotatedForResponse = session.rotated;

  if (meRes.status === 401 && refresh) {
    const again = await refreshUpstream(refresh);

    if (again) {
      rotatedForResponse = again;
      meRes = await fetchMeUpstream(again.access);
    }
  }

  if (!meRes.ok) {
    const response = NextResponse.json({ user: null });

    clearAuthCookies(response);

    return response;
  }

  const user = (await meRes.json()) as unknown;
  const response = NextResponse.json({ user });

  if (rotatedForResponse) {
    const payload: { access: string; refresh?: string } = {
      access: rotatedForResponse.access,
    };

    if (rotatedForResponse.refresh) {
      payload.refresh = rotatedForResponse.refresh;
    }

    applyAuthCookies(response, payload);
  }

  return response;
}
