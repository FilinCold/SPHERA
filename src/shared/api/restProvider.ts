import type { RestProviderConfig } from "./types";

const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
};

export class RestProvider {
  private readonly baseUrl: string;
  private readonly useBffProxy: boolean;

  constructor(config: RestProviderConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.useBffProxy = config.useBffProxy ?? false;
  }

  private resolveUrl(path: string): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    if (this.useBffProxy && typeof window !== "undefined") {
      return `${window.location.origin}/api/proxy${normalizedPath}`;
    }

    return `${this.baseUrl}${normalizedPath}`;
  }

  private async request<T>(method: string, path: string, options: RequestInit = {}): Promise<T> {
    const url = this.resolveUrl(path);
    const useCredentials = this.useBffProxy && typeof window !== "undefined";

    const headers: HeadersInit = {
      ...DEFAULT_HEADERS,
      ...options.headers,
    };

    const init: RequestInit = {
      ...options,
      method,
      headers,
    };

    if (useCredentials) {
      init.credentials = "include";
    } else if (options.credentials !== undefined) {
      init.credentials = options.credentials;
    }

    const res = await fetch(url, init);

    if (!res.ok) {
      const hasJsonResponse = res.headers.get("content-type")?.includes("application/json");
      const responseBody = hasJsonResponse ? ((await res.json()) as { message?: string }) : null;
      const message = responseBody?.message ?? `Ошибка запроса (${res.status})`;

      throw new Error(message);
    }

    if (res.status === 204) {
      return null as T;
    }

    return (await res.json()) as T;
  }

  public get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  public delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>("DELETE", path, options);
  }

  public post<TResponse, TBody>(
    path: string,
    body: TBody,
    options: RequestInit = {},
  ): Promise<TResponse> {
    return this.request<TResponse>("POST", path, {
      ...options,
      body: JSON.stringify(body),
    });
  }

  public put<TResponse, TBody>(
    path: string,
    body: TBody,
    options: RequestInit = {},
  ): Promise<TResponse> {
    return this.request<TResponse>("PUT", path, {
      ...options,
      body: JSON.stringify(body),
    });
  }
}
