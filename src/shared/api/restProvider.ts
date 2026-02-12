import type { RestProviderConfig } from "./types";

const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
};

export class RestProvider {
  private baseUrl: string;

  constructor(config: RestProviderConfig) {
    this.baseUrl = config.baseUrl;
  }

  private async request(method: string, path: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${path}`;

    const headers: HeadersInit = {
      ...DEFAULT_HEADERS,
      ...options.headers,
    };

    try {
      const res = await fetch(url, { method, ...options, headers });

      if (!res.ok) {
        throw new Error(`Ошибка: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error("Ошибка", error);
      throw error;
    }
  }

  public get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request("GET", path, options);
  }

  public delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request("DELETE", path, options);
  }

  public post<TResponse, TBody>(
    path: string,
    body: TBody,
    options: RequestInit = {},
  ): Promise<TResponse> {
    return this.request("POST", path, {
      ...options,
      body: JSON.stringify(body),
    });
  }

  public put<TResponse, TBody>(
    path: string,
    body: TBody,
    options: RequestInit = {},
  ): Promise<TResponse> {
    return this.request("PUT", path, {
      ...options,
      body: JSON.stringify(body),
    });
  }
}
