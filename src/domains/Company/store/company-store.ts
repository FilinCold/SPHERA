import { makeAutoObservable, runInAction } from "mobx";

import type { RootStore } from "@/shared/store/root-store";

import { COMPANIES_LIST_PAGE_SIZE } from "../config/companies-list.config";
import { companyRepository } from "../repositories/company-repository";

import type { CompanyInfoModel, CompanyListItem } from "../model/company-model";

export class CompanyStore {
  private _companyInfo: CompanyInfoModel | null = null;
  private _companiesList: CompanyListItem[] = [];
  private _companiesTotalCount = 0;
  /** Номер страницы с 0: offset = pageIndex × pageSize. */
  private _companiesPageIndex = 0;
  private _isLoading = false;
  private _isCompaniesListLoading = false;
  private _isCreating = false;
  private _error: string | null = null;
  private _companiesListError: string | null = null;
  private _companyForEdit: CompanyListItem | null = null;
  private _isCompanyForEditLoading = false;
  private _companyForEditError: string | null = null;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get companyInfo() {
    return this._companyInfo;
  }

  get companiesList() {
    return this._companiesList;
  }

  /** Общее число пространств (`count` в ответе API), для счётчика в шапке. */
  get companiesTotalCount() {
    return this._companiesTotalCount;
  }

  get companiesPageIndex() {
    return this._companiesPageIndex;
  }

  /** Текущая страница для UI (с 1). */
  get companiesPageDisplay() {
    return this._companiesPageIndex + 1;
  }

  get companiesPageSize() {
    return COMPANIES_LIST_PAGE_SIZE;
  }

  /** Всего страниц при текущем `count` и размере страницы. */
  get companiesTotalPages() {
    if (this._companiesTotalCount <= 0) {
      return 0;
    }

    return Math.ceil(this._companiesTotalCount / COMPANIES_LIST_PAGE_SIZE);
  }

  get hasPrevCompaniesPage() {
    return this._companiesPageIndex > 0;
  }

  get hasNextCompaniesPage() {
    return this._companiesPageIndex + 1 < this.companiesTotalPages;
  }

  get isLoading() {
    return this._isLoading;
  }

  get isCompaniesListLoading() {
    return this._isCompaniesListLoading;
  }

  get isCreating() {
    return this._isCreating;
  }

  get error() {
    return this._error;
  }

  get companiesListError() {
    return this._companiesListError;
  }

  /** Загруженная карточка для `/edit-space?companyId=`. */
  get companyForEdit() {
    return this._companyForEdit;
  }

  get isCompanyForEditLoading() {
    return this._isCompanyForEditLoading;
  }

  get companyForEditError() {
    return this._companyForEditError;
  }

  public async createCompany(name: string): Promise<boolean> {
    const trimmed = name.trim();

    if (!trimmed) {
      return false;
    }

    this._isCreating = true;
    this._error = null;

    try {
      await companyRepository.createCompany(trimmed);

      return true;
    } catch (err) {
      runInAction(() => {
        this._error = err instanceof Error ? err.message : "Неизвестная ошибка";
      });

      return false;
    } finally {
      runInAction(() => {
        this._isCreating = false;
      });
    }
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

  /**
   * Загрузка списка пространств с пагинацией: `limit = companiesPageSize`, `offset = pageIndex × limit`.
   * @param pageIndex — страница с 0 (первая: 0 → `offset=0`, вторая: 1 → `offset=5` при размере 5).
   */
  public async loadCompaniesList(pageIndex = 0) {
    this._isCompaniesListLoading = true;
    this._companiesListError = null;

    const limit = COMPANIES_LIST_PAGE_SIZE;

    try {
      let offset = pageIndex * limit;
      let { items, totalCount } = await companyRepository.listCompanies({ limit, offset });

      const totalPages = totalCount <= 0 ? 0 : Math.ceil(totalCount / limit);

      if (totalPages > 0 && pageIndex >= totalPages) {
        const safeIndex = totalPages - 1;

        offset = safeIndex * limit;
        ({ items, totalCount } = await companyRepository.listCompanies({ limit, offset }));

        runInAction(() => {
          this._companiesList = items;
          this._companiesTotalCount = totalCount;
          this._companiesPageIndex = safeIndex;
        });
      } else {
        runInAction(() => {
          this._companiesList = items;
          this._companiesTotalCount = totalCount;
          this._companiesPageIndex = totalPages === 0 ? 0 : pageIndex;
        });
      }
    } catch (err) {
      runInAction(() => {
        this._companiesListError = err instanceof Error ? err.message : "Неизвестная ошибка";
        this._companiesList = [];
        this._companiesTotalCount = 0;
        this._companiesPageIndex = 0;
      });
    } finally {
      runInAction(() => {
        this._isCompaniesListLoading = false;
      });
    }
  }

  public async goToPrevCompaniesPage() {
    if (!this.hasPrevCompaniesPage) {
      return;
    }

    await this.loadCompaniesList(this._companiesPageIndex - 1);
  }

  public async goToNextCompaniesPage() {
    if (!this.hasNextCompaniesPage) {
      return;
    }

    await this.loadCompaniesList(this._companiesPageIndex + 1);
  }

  /** Переход на страницу по индексу с 0 (синхронно с `companiesPageDisplay` = index + 1). */
  public async goToCompaniesPageByIndex(pageIndex: number) {
    const total = this.companiesTotalPages;

    if (total <= 0 || pageIndex < 0 || pageIndex >= total) {
      return;
    }

    await this.loadCompaniesList(pageIndex);
  }

  /** Загрузка пространства по id для экрана редактирования. */
  public async loadCompanyForEdit(id: string) {
    const trimmed = id.trim();

    if (!trimmed) {
      runInAction(() => {
        this._companyForEdit = null;
        this._companyForEditError = null;
      });

      return;
    }

    this._isCompanyForEditLoading = true;
    this._companyForEditError = null;

    try {
      const company = await companyRepository.getCompanyById(trimmed);

      runInAction(() => {
        this._companyForEdit = company;
      });
    } catch (err) {
      runInAction(() => {
        this._companyForEdit = null;
        this._companyForEditError =
          err instanceof Error ? err.message : "Не удалось загрузить пространство";
      });
    } finally {
      runInAction(() => {
        this._isCompanyForEditLoading = false;
      });
    }
  }

  public clearCompanyForEdit() {
    runInAction(() => {
      this._companyForEdit = null;
      this._companyForEditError = null;
      this._isCompanyForEditLoading = false;
    });
  }
}
