import { restProviderInstance } from "@/shared/api/restProviderInstance";

import {
  mapCompanyDetailPayload,
  normalizeCompaniesListResponse,
} from "../lib/map-companies-response";

import type {
  CompaniesListResult,
  CompanyEmployeeItem,
  CreateCompanyEmployeePayload,
  CompanyInfoModel,
  CompanyListItem,
  CreateCompanyResponse,
  CreateCompanySubscriptionPayload,
  UpdateCompanyEmployeePayload,
  UpdateCompanyPayload,
  UpdateCompanySubscriptionPayload,
} from "../model/company-model";

export type CompaniesListQuery = {
  limit: number;
  offset: number;
  search?: string;
};

export class CompanyRepository {
  private mapEmployeeItem(raw: unknown): CompanyEmployeeItem | null {
    if (typeof raw !== "object" || raw === null) {
      return null;
    }

    const source = raw as Record<string, unknown>;
    const idRaw = source.id;
    const emailRaw = source.email;
    const roleRaw = source.role;

    const id = typeof idRaw === "string" ? idRaw.trim() : String(idRaw ?? "").trim();
    const email = typeof emailRaw === "string" ? emailRaw.trim() : "";
    const role = typeof roleRaw === "string" ? roleRaw.trim() : "";

    if (!id || !email || !role) {
      return null;
    }

    const nameRaw = source.name;
    const name = typeof nameRaw === "string" ? nameRaw.trim() : "";

    return { id, name, email, role };
  }

  /** GET `/api/v1/companies/{slug}/employees/?limit=…&offset=…` — список сотрудников пространства. */
  public async listCompanyEmployees(slug: string): Promise<CompanyEmployeeItem[]> {
    const normalizedSlug = slug.trim();

    if (!normalizedSlug) {
      return [];
    }

    const pageSize = 100;
    let offset = 0;
    const allEmployees: CompanyEmployeeItem[] = [];
    let hasNextPage = true;

    while (hasNextPage) {
      const qs = new URLSearchParams({
        limit: String(pageSize),
        offset: String(offset),
      });
      const raw = await restProviderInstance.get<unknown>(
        `/api/v1/companies/${encodeURIComponent(normalizedSlug)}/employees/?${qs.toString()}`,
      );

      if (typeof raw !== "object" || raw === null) {
        break;
      }

      const payload = raw as Record<string, unknown>;
      const results = Array.isArray(payload.results) ? payload.results : [];
      const mappedPage = results
        .map((employeeRaw) => this.mapEmployeeItem(employeeRaw))
        .filter((employee): employee is CompanyEmployeeItem => employee !== null);

      allEmployees.push(...mappedPage);

      const nextRaw = payload.next;
      const hasNextByUrl = typeof nextRaw === "string" ? nextRaw.length > 0 : Boolean(nextRaw);
      const countRaw = payload.count;
      const totalCount = typeof countRaw === "number" && countRaw >= 0 ? countRaw : null;

      offset += pageSize;

      if (totalCount !== null) {
        hasNextPage = offset < totalCount;
      } else {
        hasNextPage = hasNextByUrl && results.length > 0;
      }
    }

    return allEmployees;
  }

  private getCompanySlugFromCreateResponse(response: CreateCompanyResponse): string {
    const rawSlug = response.slug;

    if (typeof rawSlug === "string" && rawSlug.trim()) {
      return rawSlug.trim();
    }

    throw new Error("Сервер не вернул slug созданного пространства");
  }

  public async getCompanyInfo(): Promise<CompanyInfoModel> {
    return {
      companyName: "Название компании",
      subscriptionDateFrom: "27.03.2026",
      subscriptionDateTo: "27.04.2026",
    };
  }

  /** GET `/api/v1/companies/?limit=…&offset=…` — offset = номер_страницы × limit (нулевая страница: offset=0). */
  public async listCompanies(params: CompaniesListQuery): Promise<CompaniesListResult> {
    const qs = new URLSearchParams({
      limit: String(params.limit),
      offset: String(params.offset),
    });
    const normalizedSearch = params.search?.trim();

    if (normalizedSearch) {
      qs.set("search", normalizedSearch);
    }

    const raw = await restProviderInstance.get<unknown>(`/api/v1/companies/?${qs.toString()}`);

    return normalizeCompaniesListResponse(raw);
  }

  /** GET `/api/v1/companies/:id/` — карточка пространства для edit-space. */
  public async getCompanyById(id: string): Promise<CompanyListItem> {
    const raw = await restProviderInstance.get<unknown>(
      `/api/v1/companies/${encodeURIComponent(id)}/`,
    );
    const mapped = mapCompanyDetailPayload(raw);

    if (!mapped) {
      throw new Error("Не удалось разобрать ответ сервера");
    }

    return mapped;
  }

  public async createCompany(name: string): Promise<CreateCompanyResponse> {
    return restProviderInstance.post<CreateCompanyResponse, { name: string }>(
      "/api/v1/companies/",
      {
        name,
      },
    );
  }

  /** Создаёт пространство и возвращает его slug для зависимых запросов (подписка/админ). */
  public async createCompanyAndGetSlug(name: string): Promise<string> {
    const created = await this.createCompany(name);

    return this.getCompanySlugFromCreateResponse(created);
  }

  public async updateCompany(id: string, payload: UpdateCompanyPayload): Promise<CompanyListItem> {
    const raw = await restProviderInstance.patch<unknown, UpdateCompanyPayload>(
      `/api/v1/companies/${encodeURIComponent(id)}/`,
      payload,
    );
    const mapped = mapCompanyDetailPayload(raw);

    if (!mapped) {
      throw new Error("Не удалось разобрать ответ сервера");
    }

    return mapped;
  }

  /** POST `/api/v1/companies/{slug}/subscriptions/` */
  public async createCompanySubscription(
    slug: string,
    payload: CreateCompanySubscriptionPayload,
  ): Promise<unknown> {
    return restProviderInstance.post<unknown, CreateCompanySubscriptionPayload>(
      `/api/v1/companies/${encodeURIComponent(slug)}/subscriptions/`,
      payload,
    );
  }

  /** PATCH `/api/v1/companies/{slug}/subscriptions/{id}/` */
  public async updateCompanySubscription(
    slug: string,
    subscriptionId: string,
    payload: UpdateCompanySubscriptionPayload,
  ): Promise<unknown> {
    return restProviderInstance.patch<unknown, UpdateCompanySubscriptionPayload>(
      `/api/v1/companies/${encodeURIComponent(slug)}/subscriptions/${encodeURIComponent(subscriptionId)}/`,
      payload,
    );
  }

  /** POST `/api/v1/companies/{slug}/employees/` */
  public async inviteCompanyAdmin(
    slug: string,
    payload: CreateCompanyEmployeePayload,
  ): Promise<unknown> {
    return restProviderInstance.post<unknown, CreateCompanyEmployeePayload>(
      `/api/v1/companies/${encodeURIComponent(slug)}/employees/`,
      payload,
    );
  }

  /** PATCH `/api/v1/companies/{slug}/employees/{id}/` */
  public async updateCompanyAdmin(
    slug: string,
    employeeId: string,
    payload: UpdateCompanyEmployeePayload,
  ): Promise<unknown> {
    return restProviderInstance.patch<unknown, UpdateCompanyEmployeePayload>(
      `/api/v1/companies/${encodeURIComponent(slug)}/employees/${encodeURIComponent(employeeId)}/`,
      payload,
    );
  }

  /** DELETE `/api/v1/companies/{slug}/employees/{id}/` */
  public async deleteCompanyAdmin(slug: string, employeeId: string): Promise<void> {
    await restProviderInstance.delete<void>(
      `/api/v1/companies/${encodeURIComponent(slug)}/employees/${encodeURIComponent(employeeId)}/`,
    );
  }
}

export const companyRepository = new CompanyRepository();
