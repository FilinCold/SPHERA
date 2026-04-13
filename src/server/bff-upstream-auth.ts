import { getUpstreamBaseUrl } from "./upstream";

export type TokenPair = {
  access: string;
  refresh: string;
};

export const loginUpstream = async (email: string, password: string): Promise<TokenPair> => {
  const base = getUpstreamBaseUrl();

  try {
    const res = await fetch(`${base}/api/v1/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("AUTH_FAILED");
    }

    const data = (await res.json()) as { access?: string; refresh?: string };

    if (!data.access || !data.refresh) {
      throw new Error("AUTH_INVALID_RESPONSE");
    }

    return { access: data.access, refresh: data.refresh };
  } catch (error) {
    throw new Error("Какая-то ошибка", error as Error);
  }
};

export const refreshUpstream = async (
  refresh: string,
): Promise<{ access: string; refresh?: string } | null> => {
  const base = getUpstreamBaseUrl();
  const res = await fetch(`${base}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as { access?: string; refresh?: string };

  if (!data.access) {
    return null;
  }

  const result: { access: string; refresh?: string } = { access: data.access };

  if (data.refresh) {
    result.refresh = data.refresh;
  }

  return result;
};

export const fetchMeUpstream = async (access: string): Promise<Response> => {
  const base = getUpstreamBaseUrl();

  return fetch(`${base}/api/v1/auth/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
      Accept: "application/json",
    },
  });
};
