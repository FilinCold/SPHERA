import { makeAutoObservable, runInAction } from "mobx";

import type { RootStore } from "@/shared/store/root-store";

import { COMPANIES_LIST_PAGE_SIZE } from "../config/companies-list.config";
import { companyRepository } from "../repositories/company-repository";

import type {
  CompanyEmployeeItem,
  CompanyInfoModel,
  CompanyListItem,
  CreateSpaceSetupInput,
  SaveCompanyEditInput,
} from "../model/company-model";

export class CompanyStore {
  private _companyInfo: CompanyInfoModel | null = null;
  private _companiesList: CompanyListItem[] = [];
  private _companiesTotalCount = 0;
  private _companiesSearchQuery = "";
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
  private _isCompanyForEditSaving = false;
  private _companyAdmins: CompanyEmployeeItem[] = [];
  private _isCompanyAdminsLoading = false;
  private _companyAdminsError: string | null = null;
  private _companyEmployees: CompanyEmployeeItem[] = [];
  private _isCompanyEmployeesLoading = false;
  private _companyEmployeesError: string | null = null;
  private _companyForEditInFlightId: string | null = null;
  private _companyForEditInFlightPromise: Promise<void> | null = null;
  private _companyAdminsInFlightSlug: string | null = null;
  private _companyAdminsInFlightPromise: Promise<void> | null = null;
  private _companyEmployeesInFlightSlug: string | null = null;
  private _companyEmployeesInFlightPromise: Promise<void> | null = null;

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

  get companiesSearchQuery() {
    return this._companiesSearchQuery;
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

  get isCompanyForEditSaving() {
    return this._isCompanyForEditSaving;
  }

  get companyAdmins() {
    return this._companyAdmins;
  }

  get isCompanyAdminsLoading() {
    return this._isCompanyAdminsLoading;
  }

  get companyAdminsError() {
    return this._companyAdminsError;
  }

  get companyEmployees() {
    return this._companyEmployees;
  }

  get isCompanyEmployeesLoading() {
    return this._isCompanyEmployeesLoading;
  }

  get companyEmployeesError() {
    return this._companyEmployeesError;
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

  public async createCompanyWithSetup(input: CreateSpaceSetupInput): Promise<boolean> {
    const name = input.name.trim();
    const adminFullName = input.adminFullName.trim();
    const adminEmail = input.adminEmail.trim();
    const subscriptionStartDate = input.subscriptionStartDate.trim();
    const subscriptionEndDate = input.subscriptionEndDate.trim();

    if (!name || !adminFullName || !adminEmail || !subscriptionStartDate || !subscriptionEndDate) {
      return false;
    }

    this._isCreating = true;
    this._error = null;

    try {
      // 1) Создаём пространство и получаем slug.
      const companySlug = await companyRepository.createCompanyAndGetSlug(name);

      // 2) Создаём сотрудника-администратора.
      await companyRepository.inviteCompanyAdmin(companySlug, {
        name: adminFullName,
        email: adminEmail,
        role: "COMPANY ADMIN",
      });

      // 3) Назначаем подписку для созданного пространства.
      await companyRepository.createCompanySubscription(companySlug, {
        start_date: subscriptionStartDate,
        end_date: subscriptionEndDate,
      });

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
  public async loadCompaniesList(pageIndex = 0, searchQuery?: string) {
    const effectiveSearchQuery =
      typeof searchQuery === "string" ? searchQuery.trim() : this._companiesSearchQuery;
    const isSameRequest =
      pageIndex === this._companiesPageIndex && effectiveSearchQuery === this._companiesSearchQuery;

    if (this._isCompaniesListLoading && isSameRequest) {
      return;
    }

    this._isCompaniesListLoading = true;
    this._companiesListError = null;

    const limit = COMPANIES_LIST_PAGE_SIZE;

    try {
      let offset = pageIndex * limit;
      let { items, totalCount } = await companyRepository.listCompanies({
        limit,
        offset,
        ...(effectiveSearchQuery ? { search: effectiveSearchQuery } : {}),
      });

      const totalPages = totalCount <= 0 ? 0 : Math.ceil(totalCount / limit);

      if (totalPages > 0 && pageIndex >= totalPages) {
        const safeIndex = totalPages - 1;

        offset = safeIndex * limit;
        ({ items, totalCount } = await companyRepository.listCompanies({
          limit,
          offset,
          ...(effectiveSearchQuery ? { search: effectiveSearchQuery } : {}),
        }));

        runInAction(() => {
          this._companiesList = items;
          this._companiesTotalCount = totalCount;
          this._companiesPageIndex = safeIndex;
          this._companiesSearchQuery = effectiveSearchQuery;
        });
      } else {
        runInAction(() => {
          this._companiesList = items;
          this._companiesTotalCount = totalCount;
          this._companiesPageIndex = totalPages === 0 ? 0 : pageIndex;
          this._companiesSearchQuery = effectiveSearchQuery;
        });
      }
    } catch (err) {
      runInAction(() => {
        this._companiesListError = err instanceof Error ? err.message : "Неизвестная ошибка";
        this._companiesList = [];
        this._companiesTotalCount = 0;
        this._companiesPageIndex = 0;
        this._companiesSearchQuery = effectiveSearchQuery;
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

    await this.loadCompaniesList(this._companiesPageIndex - 1, this._companiesSearchQuery);
  }

  public async goToNextCompaniesPage() {
    if (!this.hasNextCompaniesPage) {
      return;
    }

    await this.loadCompaniesList(this._companiesPageIndex + 1, this._companiesSearchQuery);
  }

  /** Переход на страницу по индексу с 0 (синхронно с `companiesPageDisplay` = index + 1). */
  public async goToCompaniesPageByIndex(pageIndex: number) {
    const total = this.companiesTotalPages;

    if (total <= 0 || pageIndex < 0 || pageIndex >= total) {
      return;
    }

    await this.loadCompaniesList(pageIndex, this._companiesSearchQuery);
  }

  public async searchCompanies(query: string) {
    await this.loadCompaniesList(0, query);
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

    if (this._companyForEditInFlightId === trimmed && this._companyForEditInFlightPromise) {
      return this._companyForEditInFlightPromise;
    }

    this._isCompanyForEditLoading = true;
    this._companyForEditError = null;

    const request = (async () => {
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
    })();

    this._companyForEditInFlightId = trimmed;
    this._companyForEditInFlightPromise = request;

    try {
      await request;
    } finally {
      if (this._companyForEditInFlightPromise === request) {
        this._companyForEditInFlightId = null;
        this._companyForEditInFlightPromise = null;
      }
    }
  }

  public clearCompanyForEdit() {
    runInAction(() => {
      this._companyForEdit = null;
      this._companyForEditError = null;
      this._isCompanyForEditLoading = false;
      this._isCompanyForEditSaving = false;
      this._companyAdmins = [];
      this._isCompanyAdminsLoading = false;
      this._companyAdminsError = null;
      this._companyEmployees = [];
      this._isCompanyEmployeesLoading = false;
      this._companyEmployeesError = null;
    });
  }

  public async loadCompanyEmployees(slug: string) {
    const normalizedSlug = slug.trim();

    if (!normalizedSlug) {
      runInAction(() => {
        this._companyEmployees = [];
        this._companyEmployeesError = null;
      });

      return;
    }

    if (
      this._companyEmployeesInFlightSlug === normalizedSlug &&
      this._companyEmployeesInFlightPromise
    ) {
      return this._companyEmployeesInFlightPromise;
    }

    this._isCompanyEmployeesLoading = true;
    this._companyEmployeesError = null;

    const request = (async () => {
      try {
        const employees = await companyRepository.listCompanyEmployees(normalizedSlug);

        runInAction(() => {
          this._companyEmployees = employees;
        });
      } catch (err) {
        runInAction(() => {
          this._companyEmployees = [];
          this._companyEmployeesError =
            err instanceof Error ? err.message : "Не удалось загрузить список пользователей";
        });
      } finally {
        runInAction(() => {
          this._isCompanyEmployeesLoading = false;
        });
      }
    })();

    this._companyEmployeesInFlightSlug = normalizedSlug;
    this._companyEmployeesInFlightPromise = request;

    try {
      await request;
    } finally {
      if (this._companyEmployeesInFlightPromise === request) {
        this._companyEmployeesInFlightSlug = null;
        this._companyEmployeesInFlightPromise = null;
      }
    }
  }

  public async loadCompanyAdmins(slug: string) {
    const normalizedSlug = slug.trim();

    if (!normalizedSlug) {
      runInAction(() => {
        this._companyAdmins = [];
        this._companyAdminsError = null;
      });

      return;
    }

    if (this._companyAdminsInFlightSlug === normalizedSlug && this._companyAdminsInFlightPromise) {
      return this._companyAdminsInFlightPromise;
    }

    this._isCompanyAdminsLoading = true;
    this._companyAdminsError = null;

    const request = (async () => {
      try {
        const employees = await companyRepository.listCompanyEmployees(normalizedSlug);
        const admins = employees.filter(
          (employee) => employee.role.toUpperCase() === "COMPANY ADMIN",
        );

        runInAction(() => {
          this._companyAdmins = admins;
        });
      } catch (err) {
        runInAction(() => {
          this._companyAdmins = [];
          this._companyAdminsError =
            err instanceof Error ? err.message : "Не удалось загрузить список администраторов";
        });
      } finally {
        runInAction(() => {
          this._isCompanyAdminsLoading = false;
        });
      }
    })();

    this._companyAdminsInFlightSlug = normalizedSlug;
    this._companyAdminsInFlightPromise = request;

    try {
      await request;
    } finally {
      if (this._companyAdminsInFlightPromise === request) {
        this._companyAdminsInFlightSlug = null;
        this._companyAdminsInFlightPromise = null;
      }
    }
  }

  public async inviteAdminToCompany(
    slug: string,
    fullName: string,
    email: string,
  ): Promise<boolean> {
    const normalizedSlug = slug.trim();
    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim();

    if (!normalizedSlug || !normalizedName || !normalizedEmail) {
      return false;
    }

    this._isCompanyAdminsLoading = true;
    this._companyAdminsError = null;

    try {
      await companyRepository.inviteCompanyAdmin(normalizedSlug, {
        name: normalizedName,
        email: normalizedEmail,
        role: "COMPANY ADMIN",
      });

      const employees = await companyRepository.listCompanyEmployees(normalizedSlug);
      const admins = employees.filter(
        (employee) => employee.role.toUpperCase() === "COMPANY ADMIN",
      );

      runInAction(() => {
        this._companyAdmins = admins;
      });

      return true;
    } catch (err) {
      runInAction(() => {
        this._companyAdminsError =
          err instanceof Error ? err.message : "Не удалось добавить администратора";
      });

      return false;
    } finally {
      runInAction(() => {
        this._isCompanyAdminsLoading = false;
      });
    }
  }

  public async updateCompanyAdmin(
    slug: string,
    employeeId: string,
    fullName: string,
    email: string,
  ): Promise<boolean> {
    const normalizedSlug = slug.trim();
    const normalizedEmployeeId = employeeId.trim();
    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim();

    if (!normalizedSlug || !normalizedEmployeeId || !normalizedName || !normalizedEmail) {
      return false;
    }

    this._isCompanyAdminsLoading = true;
    this._companyAdminsError = null;

    try {
      await companyRepository.updateCompanyAdmin(normalizedSlug, normalizedEmployeeId, {
        name: normalizedName,
        email: normalizedEmail,
        role: "COMPANY ADMIN",
      });

      const employees = await companyRepository.listCompanyEmployees(normalizedSlug);
      const admins = employees.filter(
        (employee) => employee.role.toUpperCase() === "COMPANY ADMIN",
      );

      runInAction(() => {
        this._companyAdmins = admins;
      });

      return true;
    } catch (err) {
      runInAction(() => {
        this._companyAdminsError =
          err instanceof Error ? err.message : "Не удалось обновить администратора";
      });

      return false;
    } finally {
      runInAction(() => {
        this._isCompanyAdminsLoading = false;
      });
    }
  }

  public async updateCompanyEmployeeProfile(
    slug: string,
    employeeId: string,
    input: { name: string; email: string; role: "COMPANY ADMIN" | "COMPANY USER" },
  ): Promise<boolean> {
    const normalizedSlug = slug.trim();
    const normalizedEmployeeId = employeeId.trim();
    const normalizedName = input.name.trim();
    const normalizedEmail = input.email.trim();
    const normalizedRole = input.role;

    if (!normalizedSlug || !normalizedEmployeeId || !normalizedName || !normalizedEmail) {
      return false;
    }

    this._isCompanyEmployeesLoading = true;
    this._companyEmployeesError = null;

    try {
      await companyRepository.updateCompanyEmployee(normalizedSlug, normalizedEmployeeId, {
        name: normalizedName,
        email: normalizedEmail,
        role: normalizedRole,
      });

      const employees = await companyRepository.listCompanyEmployees(normalizedSlug);

      runInAction(() => {
        this._companyEmployees = employees;
      });

      return true;
    } catch (err) {
      runInAction(() => {
        this._companyEmployeesError =
          err instanceof Error ? err.message : "Не удалось обновить данные пользователя";
      });

      return false;
    } finally {
      runInAction(() => {
        this._isCompanyEmployeesLoading = false;
      });
    }
  }

  public async createCompanyEmployee(
    slug: string,
    input: { name: string; email: string; role: "COMPANY ADMIN" | "COMPANY USER" },
  ): Promise<boolean> {
    const normalizedSlug = slug.trim();
    const normalizedName = input.name.trim();
    const normalizedEmail = input.email.trim();

    if (!normalizedSlug || !normalizedName || !normalizedEmail) {
      return false;
    }

    this._isCompanyEmployeesLoading = true;
    this._companyEmployeesError = null;

    try {
      await companyRepository.inviteCompanyAdmin(normalizedSlug, {
        name: normalizedName,
        email: normalizedEmail,
        role: input.role,
      });

      const employees = await companyRepository.listCompanyEmployees(normalizedSlug);

      runInAction(() => {
        this._companyEmployees = employees;
      });

      return true;
    } catch (err) {
      runInAction(() => {
        this._companyEmployeesError =
          err instanceof Error ? err.message : "Не удалось добавить пользователя";
      });

      return false;
    } finally {
      runInAction(() => {
        this._isCompanyEmployeesLoading = false;
      });
    }
  }

  public async deleteCompanyEmployee(slug: string, employeeId: string): Promise<boolean> {
    const normalizedSlug = slug.trim();
    const normalizedEmployeeId = employeeId.trim();

    if (!normalizedSlug || !normalizedEmployeeId) {
      return false;
    }

    this._isCompanyEmployeesLoading = true;
    this._companyEmployeesError = null;

    try {
      await companyRepository.deleteCompanyAdmin(normalizedSlug, normalizedEmployeeId);
      const employees = await companyRepository.listCompanyEmployees(normalizedSlug);

      runInAction(() => {
        this._companyEmployees = employees;
      });

      return true;
    } catch (err) {
      runInAction(() => {
        this._companyEmployeesError =
          err instanceof Error ? err.message : "Не удалось удалить пользователя";
      });

      return false;
    } finally {
      runInAction(() => {
        this._isCompanyEmployeesLoading = false;
      });
    }
  }

  public async deleteCompanyAdmin(slug: string, employeeId: string): Promise<boolean> {
    const normalizedSlug = slug.trim();
    const normalizedEmployeeId = employeeId.trim();

    if (!normalizedSlug || !normalizedEmployeeId) {
      return false;
    }

    this._isCompanyAdminsLoading = true;
    this._companyAdminsError = null;

    try {
      await companyRepository.deleteCompanyAdmin(normalizedSlug, normalizedEmployeeId);
      const employees = await companyRepository.listCompanyEmployees(normalizedSlug);
      const admins = employees.filter(
        (employee) => employee.role.toUpperCase() === "COMPANY ADMIN",
      );

      runInAction(() => {
        this._companyAdmins = admins;
      });

      return true;
    } catch (err) {
      runInAction(() => {
        this._companyAdminsError =
          err instanceof Error ? err.message : "Не удалось удалить администратора";
      });

      return false;
    } finally {
      runInAction(() => {
        this._isCompanyAdminsLoading = false;
      });
    }
  }

  public async saveEditSpace(input: SaveCompanyEditInput): Promise<boolean> {
    const slug = input.slug.trim();

    if (
      !slug ||
      (!input.companyPatch &&
        !input.subscriptionPatch &&
        !input.subscriptionPost &&
        !input.adminInvitePost)
    ) {
      return false;
    }

    this._isCompanyForEditSaving = true;
    this._companyForEditError = null;

    try {
      let effectiveSlug = slug;
      let updatedCompanyFromPatch: CompanyListItem | null = null;

      if (input.companyPatch) {
        updatedCompanyFromPatch = await companyRepository.updateCompany(
          effectiveSlug,
          input.companyPatch,
        );
        const nextSlug = updatedCompanyFromPatch.slug?.trim();

        if (nextSlug) {
          effectiveSlug = nextSlug;
        }
      }

      if (input.subscriptionPatch) {
        await companyRepository.updateCompanySubscription(
          effectiveSlug,
          input.subscriptionPatch.id,
          input.subscriptionPatch.payload,
        );
      }

      if (input.subscriptionPost) {
        await companyRepository.createCompanySubscription(effectiveSlug, input.subscriptionPost);
      }

      if (input.adminInvitePost) {
        await companyRepository.inviteCompanyAdmin(effectiveSlug, input.adminInvitePost);
      }

      const company =
        updatedCompanyFromPatch ?? (await companyRepository.getCompanyById(effectiveSlug));
      const employees = await companyRepository.listCompanyEmployees(effectiveSlug);
      const admins = employees.filter(
        (employee) => employee.role.toUpperCase() === "COMPANY ADMIN",
      );

      runInAction(() => {
        this._companyForEdit = company;
        this._companyAdmins = admins;
      });

      return true;
    } catch (err) {
      runInAction(() => {
        this._companyForEditError =
          err instanceof Error ? err.message : "Не удалось сохранить пространство";
      });

      return false;
    } finally {
      runInAction(() => {
        this._isCompanyForEditSaving = false;
      });
    }
  }
}
