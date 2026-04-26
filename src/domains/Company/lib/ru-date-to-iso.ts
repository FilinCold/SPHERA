/** YYYY-MM-DD (только дата) → ДД.ММ.ГГГГ для полей формы. */
export function isoDateOnlyToRuDate(iso: string): string | null {
  const m = iso.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!m) {
    return null;
  }

  const [, y, mo, d] = m;

  return `${d}.${mo}.${y}`;
}

/** ДД.ММ.ГГГГ → YYYY-MM-DD для API. */
export function ruDateToIsoDate(ru: string): string | null {
  const trimmed = ru.trim();
  const m = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

  if (!m) {
    const parsed = new Date(trimmed);

    if (!Number.isNaN(parsed.getTime())) {
      const y = parsed.getFullYear();
      const mo = String(parsed.getMonth() + 1).padStart(2, "0");
      const d = String(parsed.getDate()).padStart(2, "0");

      return `${y}-${mo}-${d}`;
    }

    return null;
  }

  const [, d, mo, y] = m;

  return `${y}-${mo}-${d}`;
}
