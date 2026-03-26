import type { CompanyInfoModel } from "../model/company-model";

export class CompanyRepository {
  public async getCompanyInfo(): Promise<CompanyInfoModel> {
    return {
      companyName: "Название компании",
      subscriptionDateFrom: "27.03.2026",
      subscriptionDateTo: "27.04.2026",
    };
  }
}

export const companyRepository = new CompanyRepository();
