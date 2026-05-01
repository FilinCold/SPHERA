import type { CompleteRegistrationPayload, RegistrationInvite } from "./model";

const parseErrorMessage = async (response: Response, fallback: string): Promise<string> => {
  const data = (await response.json().catch(() => null)) as
    | Record<string, unknown>
    | { message?: string; detail?: string }
    | null;

  if (!data || typeof data !== "object") {
    return fallback;
  }

  const directMessage =
    (typeof data.message === "string" && data.message) ||
    (typeof data.detail === "string" && data.detail);

  if (directMessage) {
    return directMessage;
  }

  const firstFieldError = Object.values(data).find((value) => {
    if (typeof value === "string" && value.trim().length > 0) {
      return true;
    }

    return Array.isArray(value) && typeof value[0] === "string" && value[0].trim().length > 0;
  });

  if (typeof firstFieldError === "string") {
    return firstFieldError;
  }

  if (Array.isArray(firstFieldError) && typeof firstFieldError[0] === "string") {
    return firstFieldError[0];
  }

  return fallback;
};

export class RegisterRepository {
  async fetchInvitation(registrationUuid: string): Promise<RegistrationInvite> {
    const response = await fetch(`/api/proxy/api/v1/registration/${registrationUuid}/`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Ссылка приглашения недействительна"));
    }

    const data = (await response.json()) as {
      email?: string;
      role?: string;
      company?: { name?: string } | null;
    };

    return {
      email: String(data.email ?? ""),
      role: String(data.role ?? ""),
      companyName: String(data.company?.name ?? ""),
    };
  }

  async completeRegistration(
    registrationUuid: string,
    payload: CompleteRegistrationPayload,
  ): Promise<void> {
    const response = await fetch(`/api/proxy/api/v1/registration/${registrationUuid}/`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: payload.password,
        repeat_password: payload.repeatPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Не удалось завершить регистрацию"));
    }
  }
}
