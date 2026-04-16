import type { CompaniesListResult, CompanyListItem } from "../model/company-model";

/** GET `/api/v1/companies/`: тело — объект, список в `results`. */
const RESULTS_KEY = "results" as const;

const FALLBACK_LIST_KEYS = ["data", "items", "companies", "content"] as const;

const SUBSCRIPTION_END_KEYS = [
  "subscription_valid_to",
  "subscription_end",
  "subscription_date_to",
  "valid_until",
  "subscriptionDate",
  "subscription_date",
  "date_to",
  "expires_at",
  "subscription_valid_until",
] as const;

const SUBSCRIPTION_START_KEYS = [
  "subscription_valid_from",
  "subscription_start",
  "subscription_date_from",
  "valid_from",
  "subscription_date_start",
  "date_from",
  "starts_at",
] as const;

function unwrapListPayload(raw: unknown): unknown[] {
  if (Array.isArray(raw)) {
    return raw;
  }

  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;

    const fromResults = o[RESULTS_KEY];

    if (Array.isArray(fromResults)) {
      return fromResults;
    }

    for (const key of FALLBACK_LIST_KEYS) {
      const v = o[key];

      if (Array.isArray(v)) {
        return v;
      }
    }
  }

  return [];
}

function formatRuDate(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return "—";
  }

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) {
    return value.trim();
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

function pickSubscriptionEnd(record: Record<string, unknown>): unknown {
  for (const key of SUBSCRIPTION_END_KEYS) {
    if (key in record && record[key] != null && record[key] !== "") {
      return record[key];
    }
  }

  return undefined;
}

function pickSubscriptionStart(record: Record<string, unknown>): unknown {
  for (const key of SUBSCRIPTION_START_KEYS) {
    if (key in record && record[key] != null && record[key] !== "") {
      return record[key];
    }
  }

  return undefined;
}

/** Продуктовый флаг: активность пространства/компании (`ON` / `OFF`). */
function mapStatusFromSpaceCompany(value: unknown): "active" | "inactive" | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const v = value.trim().toUpperCase();

  if (v === "ON") {
    return "active";
  }

  if (v === "OFF") {
    return "inactive";
  }

  return null;
}

function mapStatus(value: unknown): "active" | "inactive" {
  if (value === true) {
    return "active";
  }

  if (value === false) {
    return "inactive";
  }

  if (typeof value === "string") {
    const v = value.toLowerCase();

    if (["active", "activated", "enabled", "running"].includes(v)) {
      return "active";
    }

    if (["inactive", "suspended", "paused", "disabled", "cancelled", "revoked"].includes(v)) {
      return "inactive";
    }
  }

  return "active";
}

function mapRecord(item: unknown): CompanyListItem | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const r = item as Record<string, unknown>;
  const idRaw = r.id ?? r.uuid ?? r.company_id ?? r.slug ?? r.pk;
  const nameRaw = r.name ?? r.title ?? r.company_name;

  if (nameRaw == null || typeof nameRaw !== "string" || !nameRaw.trim()) {
    return null;
  }

  if (idRaw == null || (typeof idRaw !== "string" && typeof idRaw !== "number")) {
    return null;
  }

  const fromSpaceCompany = mapStatusFromSpaceCompany(r.space_company);
  const statusSource = r.status ?? r.is_active ?? r.subscription_status ?? r.state;
  const status = fromSpaceCompany ?? mapStatus(statusSource);
  const startRaw = pickSubscriptionStart(r);
  const endRaw = pickSubscriptionEnd(r);
  const subscriptionDate = formatRuDate(endRaw ?? startRaw);
  const subscriptionDateRangeStart = startRaw !== undefined ? formatRuDate(startRaw) : undefined;
  const subscriptionDateRangeEnd = endRaw !== undefined ? formatRuDate(endRaw) : undefined;

  return {
    id: String(idRaw),
    name: nameRaw.trim(),
    subscriptionDate,
    status,
    ...(subscriptionDateRangeStart !== undefined ? { subscriptionDateRangeStart } : {}),
    ...(subscriptionDateRangeEnd !== undefined ? { subscriptionDateRangeEnd } : {}),
  };
}

/** Деталь GET `/api/v1/companies/:id/` — одна запись в теле ответа. */
export function mapCompanyDetailPayload(raw: unknown): CompanyListItem | null {
  if (raw === null || raw === undefined) {
    return null;
  }

  if (typeof raw === "object" && raw !== null && "data" in raw) {
    const inner = (raw as Record<string, unknown>).data;

    return mapCompanyDetailPayload(inner);
  }

  return mapRecord(raw);
}

function pickTotalCount(raw: unknown, itemsLength: number): number {
  if (raw && typeof raw === "object" && "count" in raw) {
    const c = (raw as Record<string, unknown>).count;

    if (typeof c === "number" && Number.isFinite(c)) {
      return c;
    }
  }

  return itemsLength;
}

/**
 * Нормализует ответ GET `/api/v1/companies/`:
 * тело — `{ count, next, previous, results: [...] }`; в элементах — `name`, `slug`,
 * активность — строковый флаг `space_company`: `ON` → активна, `OFF` → приостановлена.
 */
export function normalizeCompaniesListResponse(raw: unknown): CompaniesListResult {
  const rows = unwrapListPayload(raw);
  const items = rows.map(mapRecord).filter((x): x is CompanyListItem => x !== null);

  return {
    items,
    totalCount: pickTotalCount(raw, items.length),
  };
}
