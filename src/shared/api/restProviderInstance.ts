import { getPublicEnv } from "../config/env";

import { RestProvider } from "./restProvider";

const env = getPublicEnv();

export const restProviderInstance = new RestProvider({
  baseUrl: env.NEXT_PUBLIC_API_URL,
});
