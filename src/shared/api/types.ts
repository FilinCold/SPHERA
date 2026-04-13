export type RestProviderConfig = {
  baseUrl: string;
  /** В браузере — запросы через Next BFF `/api/proxy/...` с HttpOnly-cookie. */
  useBffProxy?: boolean;
};
