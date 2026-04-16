/** Данные формы made-space → edit-space (sessionStorage). */
export const MADE_SPACE_EDIT_SPACE_STORAGE_KEY = "sphera.madeSpaceToEditSpace";

/** Однократно читает и удаляет данные из sessionStorage (только в браузере). */
export function consumeMadeSpaceHandoffFromSession(): MadeSpaceHandoffPayload | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(MADE_SPACE_EDIT_SPACE_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as MadeSpaceHandoffPayload;

    sessionStorage.removeItem(MADE_SPACE_EDIT_SPACE_STORAGE_KEY);

    return parsed;
  } catch {
    sessionStorage.removeItem(MADE_SPACE_EDIT_SPACE_STORAGE_KEY);

    return null;
  }
}

export type MadeSpaceHandoffPayload = {
  spaceName: string;
  fio: string;
  email: string;
  subscriptionDateRangeStart: string;
  subscriptionDateRangeEnd: string;
};

export function splitFioIntoParts(fio: string): {
  firstName: string;
  lastName: string;
  middleName: string;
} {
  const parts = fio.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] ?? "",
    lastName: parts[1] ?? "",
    middleName: parts.slice(2).join(" "),
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Проверка обязательных полей формы создания пространства (made-space). */
export function isMadeSpaceFormComplete(data: Record<string, string | undefined>): boolean {
  const spaceName = typeof data.name === "string" ? data.name.trim() : "";
  const fio = typeof data.fio === "string" ? data.fio.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const subStart = data.subscriptionDateRangeStart;
  const subEnd = data.subscriptionDateRangeEnd;

  if (!spaceName || !fio || !email) {
    return false;
  }

  if (typeof subStart !== "string" || typeof subEnd !== "string") {
    return false;
  }

  if (!subStart.trim() || !subEnd.trim()) {
    return false;
  }

  return EMAIL_RE.test(email);
}
