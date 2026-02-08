import type { RestProviderConfig } from "./type";

export class RestProvider {
  private baseUrl: string;

  constructor(config: RestProviderConfig) {
    this.baseUrl = config.baseUrl;
  }

  private async request(method: string, path: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${path}`;

    try {
      const res = await fetch(url, { method, ...options });

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
      headers: { "Content-Type": "application/json", ...options.headers },
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
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  }
}
