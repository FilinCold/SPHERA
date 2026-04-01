import { makeAutoObservable, runInAction } from "mobx";

import type { RootStore } from "@/shared/store/root-store";

import { companyRepository } from "../repositories/company-repository";

import type { CompanyInfoModel } from "../model/company-model";

export class CompanyStore {
  private _companyInfo: CompanyInfoModel | null = null;
  private _isLoading = false;
  private _error: string | null = null;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get companyInfo() {
    return this._companyInfo;
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }

  public async getCompanyInfo() {
    this._isLoading = true;
    this._error = null;

    try {
      const info = await companyRepository.getCompanyInfo();

      runInAction(() => {
        this._companyInfo = info;
      });
    } catch (err) {
      runInAction(() => {
        this._error = err instanceof Error ? err.message : "Неизвестная ошибка";
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }
}
