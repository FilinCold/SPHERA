import { NextResponse } from "next/server";

import {
  BFF_COOKIE_ACCESS,
  BFF_COOKIE_REFRESH,
  applyAuthCookies,
  clearAuthCookies,
} from "@/server/bff-cookies";
import { refreshUpstream } from "@/server/bff-upstream-auth";
import { getUpstreamBaseUrl } from "@/server/upstream";

import type { NextRequest } from "next/server";

const BLOCKED_PREFIX = "/api/v1/auth/token";

const buildUpstreamPath = (pathname: string): string | null => {
  const PROXY_PREFIX = "/api/proxy";

  if (!pathname.startsWith(PROXY_PREFIX)) {
    return null;
  }

  // Keep the original trailing slash from client URL to avoid Django redirect
  // from `/resource` -> `/resource/`, which may break POST semantics.
  const joined = pathname.slice(PROXY_PREFIX.length);

  if (!joined) {
    return null;
  }

  if (joined.includes("..")) {
    return null;
  }

  if (!joined.startsWith("/api/v1/")) {
    return null;
  }

  if (joined === BLOCKED_PREFIX || joined.startsWith(`${BLOCKED_PREFIX}/`)) {
    return null;
  }

  return joined;
};

const forward = async (
  req: NextRequest,
  upstreamPath: string,
  access: string | undefined,
): Promise<Response> => {
  const base = getUpstreamBaseUrl();
  const incomingUrl = new URL(req.url);
  const target = `${base}${upstreamPath}${incomingUrl.search}`;
  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await req.arrayBuffer() : undefined;
  const contentType = req.headers.get("content-type");

  const headers = new Headers();

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (access) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  const init: RequestInit = { method, headers };

  if (body && body.byteLength > 0) {
    init.body = body;
  }

  return fetch(target, init);
};

const buildClientResponse = async (
  upstreamRes: Response,
  rotated: { access: string; refresh?: string } | null,
): Promise<NextResponse> => {
  const contentType = upstreamRes.headers.get("content-type") ?? "application/json";
  const body = await upstreamRes.text();
  const response = new NextResponse(body, {
    status: upstreamRes.status,
    headers: {
      "Content-Type": contentType,
    },
  });

  if (rotated) {
    applyAuthCookies(response, rotated);
  }

  return response;
};

async function handle(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  await context.params;
  const incomingUrl = new URL(req.url);
  const upstreamPath = buildUpstreamPath(incomingUrl.pathname);

  if (!upstreamPath) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  let access = req.cookies.get(BFF_COOKIE_ACCESS)?.value;
  const refresh = req.cookies.get(BFF_COOKIE_REFRESH)?.value;
  let rotated: { access: string; refresh?: string } | null = null;

  if (!access && refresh) {
    const refreshed = await refreshUpstream(refresh);

    if (refreshed) {
      access = refreshed.access;
      rotated = refreshed;
    }
  }

  let upstreamRes = await forward(req, upstreamPath, access);

  if (upstreamRes.status === 401 && refresh) {
    const refreshed = await refreshUpstream(refresh);

    if (refreshed) {
      access = refreshed.access;
      rotated = refreshed;
      upstreamRes = await forward(req, upstreamPath, access);
    } else {
      const cleared = NextResponse.json({ message: "Сессия истекла" }, { status: 401 });

      clearAuthCookies(cleared);

      return cleared;
    }
  }

  if (upstreamRes.status === 401) {
    const cleared = NextResponse.json({ message: "Сессия истекла" }, { status: 401 });

    clearAuthCookies(cleared);

    return cleared;
  }

  return buildClientResponse(upstreamRes, rotated);
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handle(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handle(req, ctx);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handle(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handle(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handle(req, ctx);
}
