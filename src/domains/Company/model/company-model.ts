export interface CompanyInfoModel {
  companyName: string;
  subscriptionDateFrom: string;
  subscriptionDateTo: string;
}

/** Элемент списка пространств для UI (company-space). */
export type CompanyListItem = {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  /** id активной подписки, если вернулся в actual_subscriptions. */
  activeSubscriptionId?: string;
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

/** Ответ POST `/api/v1/companies/` — для дальнейших зависимых запросов нужен slug компании. */
export type CreateCompanyResponse = {
  slug?: string | null;
  id?: string | number;
  name?: string;
};

export type UpdateCompanyPayload = {
  name: string;
  description: string;
};

/** POST `/api/v1/companies/{slug}/subscriptions/` — поля уточняются по контракту бэкенда. */
export type CreateCompanySubscriptionPayload = {
  start_date: string;
  end_date: string;
  status?: "ACTIVE" | "SUSPENDED";
};

export type UpdateCompanySubscriptionPayload = {
  start_date: string;
  end_date: string;
  status?: "ACTIVE" | "SUSPENDED";
};

/** POST `/api/v1/companies/{slug}/employees/` */
export type CreateCompanyEmployeePayload = {
  name: string;
  email: string;
  role: "COMPANY ADMIN" | "COMPANY USER";
};

export type UpdateCompanyEmployeePayload = {
  name: string;
  email: string;
  role: "COMPANY ADMIN" | "COMPANY USER";
};

export type UpdateCompanyEmployeeProfilePayload = {
  name: string;
  email: string;
  role: "COMPANY ADMIN" | "COMPANY USER";
};

export type SaveCompanyEditInput = {
  slug: string;
  companyPatch?: UpdateCompanyPayload;
  subscriptionPost?: CreateCompanySubscriptionPayload;
  subscriptionPatch?: {
    id: string;
    payload: UpdateCompanySubscriptionPayload;
  };
  adminInvitePost?: CreateCompanyEmployeePayload;
};

export type CompanyEmployeeItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  registrationStatus?: string;
};

export type CreateSpaceSetupInput = {
  name: string;
  adminFullName: string;
  adminEmail: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
};
