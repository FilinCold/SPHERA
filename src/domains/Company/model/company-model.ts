export interface CompanyInfoModel {
  companyName: string;
  subscriptionDateFrom: string;
  subscriptionDateTo: string;
}

/** Элемент списка пространств для UI (company-space). */
export type CompanyListItem = {
  id: string;
  name: string;
  /** Уже отформатировано для карточки (например ДД.ММ.ГГГГ). */
  subscriptionDate: string;
  status: "active" | "inactive";
  /** Даты подписки для формы edit-space, если бэкенд отдал период. */
  subscriptionDateRangeStart?: string;
  subscriptionDateRangeEnd?: string;
};

/** Нормализованный ответ GET `/api/v1/companies/` (Django REST: count, next, previous, results). */
export type CompaniesListResult = {
  items: CompanyListItem[];
  /** Всего записей с сервера (`count`), не только на текущей странице. */
  totalCount: number;
};

/** Ответ POST `/api/v1/companies` — уточняется по контракту бэкенда. */
export type CreateCompanyResponse = Record<string, unknown>;
