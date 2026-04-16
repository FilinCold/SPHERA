/** Маска дд.мм.гггг: только цифры, до 8 (ДДММГГГГ), точки вставляются автоматически. */

const MAX_DIGITS = 8;

export function extractDateDigits(input: string): string {
  return input.replace(/\D/g, "").slice(0, MAX_DIGITS);
}

export function formatDigitsToDdMmYyyy(rawDigits: string): string {
  const r = rawDigits.slice(0, MAX_DIGITS);

  if (r.length === 0) {
    return "";
  }

  const dd = r.slice(0, 2);

  if (r.length <= 2) {
    return dd;
  }

  const mm = r.slice(2, 4);

  if (r.length <= 4) {
    return `${dd}.${mm}`;
  }

  const yyyy = r.slice(4, 8);

  return `${dd}.${mm}.${yyyy}`;
}

/**
 * Структурная проверка при вводе (без календарной валидности 31/02 и т.д. —
 * это только на blur, иначе 8-я цифра года сбрасывалась при «невозможной» дате).
 */
function isValidPartialDateDigits(digits: string): boolean {
  const n = digits.length;

  if (n === 0) {
    return true;
  }

  if (n <= 2) {
    if (n === 1) {
      const d = Number.parseInt(digits[0]!, 10);

      return d >= 0 && d <= 9;
    }

    const day = Number.parseInt(digits.slice(0, 2), 10);

    return day >= 1 && day <= 31;
  }

  if (n <= 4) {
    const day = Number.parseInt(digits.slice(0, 2), 10);
    const m1 = Number.parseInt(digits[2]!, 10);

    if (day < 1 || day > 31) {
      return false;
    }

    if (n === 3) {
      return m1 >= 0 && m1 <= 1;
    }

    const month = Number.parseInt(digits.slice(2, 4), 10);

    return month >= 1 && month <= 12;
  }

  if (n <= 7) {
    const day = Number.parseInt(digits.slice(0, 2), 10);
    const month = Number.parseInt(digits.slice(2, 4), 10);

    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return false;
    }

    return true;
  }

  if (n === 8) {
    const day = Number.parseInt(digits.slice(0, 2), 10);
    const month = Number.parseInt(digits.slice(2, 4), 10);
    const year = Number.parseInt(digits.slice(4, 8), 10);

    return day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1000 && year <= 9999;
  }

  return false;
}

/** Убирает завершающие цифры, пока префикс допустим как маска дд.мм.гггг (не календарь). */
export function sanitizeDateDigits(input: string): string {
  let digits = extractDateDigits(input);

  while (digits.length > 0 && !isValidPartialDateDigits(digits)) {
    digits = digits.slice(0, -1);
  }

  return digits;
}

/** 1 января текущего года (локально) — нижняя граница года в календаре подписки. */
export function getSubscriptionMinCalendarDate(): Date {
  const d = new Date();

  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);

  return d;
}

/** Верхняя граница даты подписки: тот же календарный день, через 5 лет от сегодня (локальное время). */
export function getSubscriptionMaxCalendarDate(): Date {
  const d = new Date();

  d.setFullYear(d.getFullYear() + 5);
  d.setHours(0, 0, 0, 0);

  return d;
}

export function isCalendarDateNotAfterMax(candidate: Date, maxCalendar: Date): boolean {
  const c = new Date(candidate.getFullYear(), candidate.getMonth(), candidate.getDate());
  const m = new Date(maxCalendar.getFullYear(), maxCalendar.getMonth(), maxCalendar.getDate());

  return c.getTime() <= m.getTime();
}

/** Год даты не меньше заданного календарного года (например текущего). */
export function isCalendarYearNotBefore(candidate: Date, minYear: number): boolean {
  return candidate.getFullYear() >= minYear;
}

/** Нормализация введённого «дд.мм.гггг» с допуском однозначных дня/месяца и двузначного года. */
export function normalizeRussianDateString(input: string): string | undefined {
  const trimmed = input.trim();

  if (!trimmed) {
    return undefined;
  }

  const parts = trimmed.split(".").map((p) => p.trim());

  if (parts.length !== 3) {
    return undefined;
  }

  const ds = parts[0];
  const ms = parts[1];
  const ys = parts[2];

  if (ds === undefined || ms === undefined || ys === undefined) {
    return undefined;
  }

  if (!/^\d+$/.test(ds) || !/^\d+$/.test(ms) || !/^\d+$/.test(ys)) {
    return undefined;
  }

  const day = Number(ds.padStart(2, "0"));
  const month = Number(ms.padStart(2, "0"));
  let year = Number(ys);

  if (ys.length === 2) {
    year = year < 50 ? 2000 + year : 1900 + year;
  } else if (ys.length !== 4) {
    return undefined;
  }

  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined;
  }

  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");

  return `${dd}.${mm}.${year}`;
}

export function formatDateRu(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());

  return `${dd}.${mm}.${yyyy}`;
}

export function parseDateRu(value: string): Date | undefined {
  const normalized = normalizeRussianDateString(value);

  if (!normalized) {
    return undefined;
  }

  const segments = normalized.split(".");
  const dd = Number(segments[0]);
  const mm = Number(segments[1]);
  const yyyy = Number(segments[2]);

  if (Number.isNaN(dd) || Number.isNaN(mm) || Number.isNaN(yyyy)) {
    return undefined;
  }

  return new Date(yyyy, mm - 1, dd);
}
