export const getUpstreamBaseUrl = (): string => {
  const raw = process.env.NEXT_PUBLIC_API_URL;

  if (!raw) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  return raw.replace(/\/$/, "");
};
