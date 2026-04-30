import type { RestProviderConfig } from "./types";

const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
};

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

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

  /**
   * Django DRF в проекте ожидает trailing slash для mutating endpoint'ов.
   * Нормализуем `/api/v1/resource` -> `/api/v1/resource/`, сохраняя query string.
   */
  private normalizePathForRequest(path: string, method: string): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    if (!MUTATION_METHODS.has(method.toUpperCase()) || !normalizedPath.startsWith("/api/v1/")) {
      return normalizedPath;
    }

    const [rawPathname, query = ""] = normalizedPath.split("?");
    const pathname = rawPathname ?? normalizedPath;

    if (pathname.endsWith("/")) {
      return normalizedPath;
    }

    return `${pathname}/${query ? `?${query}` : ""}`;
  }

  private async request<T>(method: string, path: string, options: RequestInit = {}): Promise<T> {
    const normalizedPath = this.normalizePathForRequest(path, method);
    const url = this.resolveUrl(normalizedPath);
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

  public patch<TResponse, TBody>(
    path: string,
    body: TBody,
    options: RequestInit = {},
  ): Promise<TResponse> {
    return this.request<TResponse>("PATCH", path, {
      ...options,
      body: JSON.stringify(body),
    });
  }
}
