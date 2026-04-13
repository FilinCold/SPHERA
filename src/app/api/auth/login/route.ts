import { NextResponse } from "next/server";

import { applyAuthCookies } from "@/server/bff-cookies";
import { fetchMeUpstream, loginUpstream } from "@/server/bff-upstream-auth";

import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };

  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ message: "Некорректное тело запроса" }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ message: "Укажите email и пароль" }, { status: 400 });
  }

  try {
    const tokens = await loginUpstream(email, password);

    const meRes = await fetchMeUpstream(tokens.access);

    if (!meRes.ok) {
      return NextResponse.json({ message: "Не удалось получить профиль" }, { status: 502 });
    }

    const user = (await meRes.json()) as unknown;
    const response = NextResponse.json({ user });

    applyAuthCookies(response, tokens);

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_FAILED") {
      return NextResponse.json({ message: "Неверный email или пароль" }, { status: 401 });
    }

    return NextResponse.json({ message: "Ошибка входа" }, { status: 500 });
  }
}
