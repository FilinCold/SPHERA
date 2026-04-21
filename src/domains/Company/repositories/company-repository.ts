import { restProviderInstance } from "@/shared/api/restProviderInstance";

import {
  mapCompanyDetailPayload,
  normalizeCompaniesListResponse,
} from "../lib/map-companies-response";

import type {
  CompaniesListResult,
  CompanyInfoModel,
  CompanyListItem,
  CreateCompanyResponse,
  CreateCompanySubscriptionPayload,
  UpdateCompanyPayload,
} from "../model/company-model";

export type CompaniesListQuery = {
  limit: number;
  offset: number;
};

export class CompanyRepository {
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
}

export const companyRepository = new CompanyRepository();
