"use client";

import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ruDateToIsoDate } from "@/domains/Company/lib/ru-date-to-iso";
import type {
  CreateCompanySubscriptionPayload,
  SaveCompanyEditInput,
  UpdateCompanySubscriptionPayload,
} from "@/domains/Company/model/company-model";
import { Modal } from "@/shared/components/MenuItem/Modal";
import { SimpleCard } from "@/shared/components/SimpleCard/SimpleCard";
import type { FormData, InputField } from "@/shared/components/SimpleCard/types";
import TitleBar from "@/shared/components/TitleBar/TitleBar";
import {
  consumeMadeSpaceHandoffFromSession,
  type MadeSpaceHandoffPayload,
} from "@/shared/config/made-space-handoff";
import { PAGES } from "@/shared/config/pages.config";
import { useStores } from "@/shared/store";

import deleteIcon from "./icon/delete.svg";
import editIcon from "./icon/edit.svg";
import styles from "./page.module.scss";

const requestFields: InputField[] = [
  {
    name: "spaceName",
    label: "Имя компании*",
    placeholder: "Введите имя компании",
    required: true,
  },
  {
    name: "subscriptionStatus",
    label: "Статус подписки:",
    type: "readonly",
  },
  {
    name: "subscriptionDateRange",
    label: "Дата подписки",
    type: "dateRange",
    placeholder: "__.__.____",
  },
];

type EditSpaceSnapshot = {
  spaceName: string;
  subscriptionStatus: string;
  subscriptionDateRangeStart: string;
  subscriptionDateRangeEnd: string;
};

type KeyedState<T> = {
  key: string;
  data: T;
};

const normalizeString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const SIMPLE_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mapUiStatusToApiStatus = (status: string): "ACTIVE" | "SUSPENDED" =>
  status === "inactive" ? "SUSPENDED" : "ACTIVE";
const formatSubscriptionStatus = (status: string): string =>
  status === "inactive" ? "Приостановлено" : "Активно";

function EditSpaceViewComponent() {
  const searchParams = useSearchParams();
  const companySlug = searchParams.get("slug") ?? searchParams.get("companyId");
  const { companyStore } = useStores();

  const [handoff] = useState<MadeSpaceHandoffPayload | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const params = new URLSearchParams(window.location.search);

    if (params.get("slug") || params.get("companyId")) {
      return null;
    }

    return consumeMadeSpaceHandoffFromSession();
  });

  useEffect(() => {
    if (companySlug) {
      void companyStore.loadCompanyForEdit(companySlug);
      void companyStore.loadCompanyAdmins(companySlug);
    } else {
      companyStore.clearCompanyForEdit();
    }

    return () => {
      companyStore.clearCompanyForEdit();
    };
  }, [companySlug, companyStore]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextSlug = companyStore.companyForEdit?.slug?.trim();

    if (!nextSlug) {
      return;
    }

    const currentUrl = new URL(window.location.href);
    const currentSlug = currentUrl.searchParams.get("slug");

    // Если slug изменился после переименования, обновляем URL без перезагрузки страницы.
    if (!currentSlug || currentSlug === nextSlug) {
      return;
    }

    currentUrl.searchParams.set("slug", nextSlug);
    window.history.replaceState(
      {},
      "",
      `${currentUrl.pathname}?${currentUrl.searchParams.toString()}`,
    );
  }, [companyStore.companyForEdit?.slug]);

  const {
    companyForEdit,
    isCompanyForEditLoading,
    companyForEditError,
    companyAdmins,
    isCompanyAdminsLoading,
    companyAdminsError,
  } = companyStore;

  const cardsKey = useMemo(() => {
    if (companySlug && companyForEdit) {
      return `company-${companyForEdit.id}`;
    }

    if (handoff) {
      return `handoff-${handoff.email}-${handoff.subscriptionDateRangeStart}`;
    }

    return "empty";
  }, [companySlug, companyForEdit, handoff]);

  const spaceTitle = useMemo(() => {
    if (companyForEdit?.name?.trim()) {
      return companyForEdit.name.trim();
    }

    return handoff?.spaceName?.trim() || "Пространство";
  }, [companyForEdit, handoff]);

  const requestInitial = useMemo((): Partial<FormData> => {
    if (companySlug && companyForEdit) {
      const c = companyForEdit;
      const endRaw =
        c.subscriptionDateRangeEnd ?? (c.subscriptionDate !== "—" ? c.subscriptionDate : "");
      const startRaw = c.subscriptionDateRangeStart ?? endRaw;

      return {
        spaceName: c.name.trim(),
        subscriptionStatus: formatSubscriptionStatus(c.status),
        subscriptionDateRangeStart: startRaw,
        subscriptionDateRangeEnd: endRaw,
      };
    }

    const base: Partial<FormData> = {
      subscriptionStatus: "Активно",
    };

    if (!handoff) {
      return base;
    }

    return {
      ...base,
      spaceName: handoff.spaceName.trim(),
      subscriptionDateRangeStart: handoff.subscriptionDateRangeStart,
      subscriptionDateRangeEnd: handoff.subscriptionDateRangeEnd,
    };
  }, [companySlug, companyForEdit, handoff]);

  const [requestState, setRequestState] = useState<KeyedState<Partial<FormData>>>(() => ({
    key: cardsKey,
    data: requestInitial,
  }));
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
  const [adminToEditId, setAdminToEditId] = useState<string | null>(null);
  const [adminToDeleteId, setAdminToDeleteId] = useState<string | null>(null);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminTouched, setNewAdminTouched] = useState<{ name: boolean; email: boolean }>({
    name: false,
    email: false,
  });
  const [createAdminError, setCreateAdminError] = useState<string | null>(null);
  const [editAdminError, setEditAdminError] = useState<string | null>(null);
  const [deleteAdminError, setDeleteAdminError] = useState<string | null>(null);
  const [isCreateAdminSubmitting, setIsCreateAdminSubmitting] = useState(false);
  const [isEditAdminSubmitting, setIsEditAdminSubmitting] = useState(false);
  const [isDeleteAdminSubmitting, setIsDeleteAdminSubmitting] = useState(false);

  const requestCurrent = useMemo(
    () => (requestState.key === cardsKey ? requestState.data : requestInitial),
    [requestState, cardsKey, requestInitial],
  );

  const initialSnapshot = useMemo<EditSpaceSnapshot>(() => {
    const request = requestInitial;

    return {
      spaceName: normalizeString(request.spaceName),
      subscriptionStatus: normalizeString(request.subscriptionStatus),
      subscriptionDateRangeStart: normalizeString(request.subscriptionDateRangeStart),
      subscriptionDateRangeEnd: normalizeString(request.subscriptionDateRangeEnd),
    };
  }, [requestInitial]);

  const currentSnapshot = useMemo<EditSpaceSnapshot>(() => {
    const request = { ...requestInitial, ...requestCurrent };

    return {
      spaceName: normalizeString(request.spaceName),
      subscriptionStatus: normalizeString(request.subscriptionStatus),
      subscriptionDateRangeStart: normalizeString(request.subscriptionDateRangeStart),
      subscriptionDateRangeEnd: normalizeString(request.subscriptionDateRangeEnd),
    };
  }, [requestInitial, requestCurrent]);

  const nameChanged = currentSnapshot.spaceName !== initialSnapshot.spaceName;
  const statusChanged = currentSnapshot.subscriptionStatus !== initialSnapshot.subscriptionStatus;
  const initialStartIso = ruDateToIsoDate(initialSnapshot.subscriptionDateRangeStart) ?? "";
  const initialEndIso = ruDateToIsoDate(initialSnapshot.subscriptionDateRangeEnd) ?? "";
  const currentStartIso = ruDateToIsoDate(currentSnapshot.subscriptionDateRangeStart) ?? "";
  const currentEndIso = ruDateToIsoDate(currentSnapshot.subscriptionDateRangeEnd) ?? "";
  const subscriptionDatesChanged =
    currentStartIso !== initialStartIso || currentEndIso !== initialEndIso;
  const requestColumnChanged = nameChanged || statusChanged || subscriptionDatesChanged;
  const hasPersistableChanges = requestColumnChanged;
  const isRequestSaveDisabled =
    !hasPersistableChanges ||
    isCompanyForEditLoading ||
    companyStore.isCompanyForEditSaving ||
    !companySlug;

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    if (!companySlug || !companyForEdit || !hasPersistableChanges) {
      return;
    }

    let subscriptionPost: CreateCompanySubscriptionPayload | undefined;
    let subscriptionPatch:
      | {
          id: string;
          payload: UpdateCompanySubscriptionPayload;
        }
      | undefined;

    if (subscriptionDatesChanged || statusChanged) {
      const startDate = ruDateToIsoDate(currentSnapshot.subscriptionDateRangeStart);
      const endDate = ruDateToIsoDate(currentSnapshot.subscriptionDateRangeEnd);

      if (!startDate || !endDate) {
        return;
      }

      const subscriptionPayload: UpdateCompanySubscriptionPayload = {
        start_date: startDate,
        end_date: endDate,
        ...(statusChanged
          ? { status: mapUiStatusToApiStatus(currentSnapshot.subscriptionStatus) }
          : {}),
      };

      const activeSubscriptionId = companyForEdit.activeSubscriptionId?.trim();

      if (activeSubscriptionId) {
        subscriptionPatch = {
          id: activeSubscriptionId,
          payload: subscriptionPayload,
        };
      } else {
        /** Fallback: если активной подписки нет, создаём новую запись подписки. */
        subscriptionPost = {
          start_date: subscriptionPayload.start_date,
          end_date: subscriptionPayload.end_date,
          ...(subscriptionPayload.status ? { status: subscriptionPayload.status } : {}),
        };
      }
    }

    if (!nameChanged && !statusChanged && !subscriptionPost && !subscriptionPatch) {
      return;
    }

    const payload: SaveCompanyEditInput = {
      slug: companySlug,
      ...(nameChanged
        ? {
            companyPatch: {
              name: currentSnapshot.spaceName,
              // Backend валидирует description как непустое поле, поэтому используем технический fallback.
              description: companyForEdit.description ?? "1",
            },
          }
        : {}),
      ...(subscriptionPatch ? { subscriptionPatch } : {}),
      ...(subscriptionPost ? { subscriptionPost } : {}),
    };

    await companyStore.saveEditSpace(payload);
  };

  const openCreateAdminModal = () => {
    setCreateAdminError(null);
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminTouched({ name: false, email: false });
    setIsCreateAdminModalOpen(true);
  };

  const closeCreateAdminModal = () => {
    if (isCreateAdminSubmitting) {
      return;
    }

    setIsCreateAdminModalOpen(false);
    setCreateAdminError(null);
    setNewAdminTouched({ name: false, email: false });
  };

  const adminToEdit = useMemo(
    () => companyAdmins.find((admin) => admin.id === adminToEditId) ?? null,
    [companyAdmins, adminToEditId],
  );
  const adminToDelete = useMemo(
    () => companyAdmins.find((admin) => admin.id === adminToDeleteId) ?? null,
    [companyAdmins, adminToDeleteId],
  );

  const normalizedAdminName = newAdminName.trim();
  const normalizedAdminEmail = newAdminEmail.trim();
  const isAdminNameValid = normalizedAdminName.length > 0;
  const isAdminEmailFilled = normalizedAdminEmail.length > 0;
  const isAdminEmailFormatValid = SIMPLE_EMAIL_RE.test(normalizedAdminEmail);
  const isCreateAdminFormValid = isAdminNameValid && isAdminEmailFilled && isAdminEmailFormatValid;
  const isEditAdminFormChanged =
    normalizedAdminName !== (adminToEdit?.name.trim() ?? "") ||
    normalizedAdminEmail !== (adminToEdit?.email.trim() ?? "");
  const isEditAdminFormValid = isCreateAdminFormValid && isEditAdminFormChanged;
  const nameFieldError = !isAdminNameValid ? "Поле ФИО обязательно" : "";
  const emailFieldError = !isAdminEmailFilled
    ? "Поле Email обязательно"
    : !isAdminEmailFormatValid
      ? "Введите корректный email"
      : "";

  const handleCreateAdminSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!companySlug) {
      setCreateAdminError("Не удалось определить пространство");

      return;
    }

    setNewAdminTouched({ name: true, email: true });
    if (!isCreateAdminFormValid) {
      setCreateAdminError("Проверьте корректность заполнения полей");

      return;
    }

    const fullName = normalizedAdminName;
    const email = normalizedAdminEmail;

    setCreateAdminError(null);
    setIsCreateAdminSubmitting(true);

    try {
      const ok = await companyStore.inviteAdminToCompany(companySlug, fullName, email);

      if (!ok) {
        setCreateAdminError(companyStore.companyAdminsError ?? "Не удалось создать администратора");

        return;
      }

      setIsCreateAdminModalOpen(false);
      setNewAdminName("");
      setNewAdminEmail("");
    } finally {
      setIsCreateAdminSubmitting(false);
    }
  };

  const openEditAdminModal = (adminId: string) => {
    const admin = companyAdmins.find((item) => item.id === adminId);

    if (!admin) {
      return;
    }

    setAdminToEditId(adminId);
    setNewAdminName(admin.name);
    setNewAdminEmail(admin.email);
    setNewAdminTouched({ name: false, email: false });
    setEditAdminError(null);
  };

  const closeEditAdminModal = () => {
    if (isEditAdminSubmitting) {
      return;
    }

    setAdminToEditId(null);
    setNewAdminTouched({ name: false, email: false });
    setEditAdminError(null);
  };

  const handleEditAdminSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!companySlug || !adminToEdit) {
      setEditAdminError("Не удалось определить администратора");

      return;
    }

    setNewAdminTouched({ name: true, email: true });
    if (!isEditAdminFormValid) {
      setEditAdminError(isEditAdminFormChanged ? "Проверьте корректность заполнения полей" : null);

      return;
    }

    setEditAdminError(null);
    setIsEditAdminSubmitting(true);

    try {
      const ok = await companyStore.updateCompanyAdmin(
        companySlug,
        adminToEdit.id,
        normalizedAdminName,
        normalizedAdminEmail,
      );

      if (!ok) {
        setEditAdminError(companyStore.companyAdminsError ?? "Не удалось обновить администратора");

        return;
      }

      closeEditAdminModal();
    } finally {
      setIsEditAdminSubmitting(false);
    }
  };

  const openDeleteAdminModal = (adminId: string) => {
    setAdminToDeleteId(adminId);
    setDeleteAdminError(null);
  };

  const closeDeleteAdminModal = () => {
    if (isDeleteAdminSubmitting) {
      return;
    }

    setAdminToDeleteId(null);
    setDeleteAdminError(null);
  };

  const handleDeleteAdmin = async () => {
    if (!companySlug || !adminToDelete) {
      setDeleteAdminError("Не удалось определить администратора");

      return;
    }

    setDeleteAdminError(null);
    setIsDeleteAdminSubmitting(true);

    try {
      const ok = await companyStore.deleteCompanyAdmin(companySlug, adminToDelete.id);

      if (!ok) {
        setDeleteAdminError(companyStore.companyAdminsError ?? "Не удалось удалить администратора");

        return;
      }

      closeDeleteAdminModal();
    } finally {
      setIsDeleteAdminSubmitting(false);
    }
  };

  const showCompanyLoading = Boolean(companySlug) && isCompanyForEditLoading;
  const showCompanyError =
    Boolean(companySlug) && !isCompanyForEditLoading && Boolean(companyForEditError);
  const showCompanyForm =
    Boolean(companySlug) &&
    !isCompanyForEditLoading &&
    Boolean(companyForEdit) &&
    !companyForEditError;
  const showHandoffOrEmptyForm = !companySlug;

  return (
    <div className={styles.layout}>
      <TitleBar
        appearance="spaceEdit"
        breadcrumbSeparator=" | "
        breadcrumbs={[{ label: "Пространство", href: PAGES.COMPANY_SPACE }, { label: spaceTitle }]}
        hideActionButton
        title={spaceTitle}
      />

      <main className={styles.main}>
        {showCompanyLoading ? (
          <p className={styles.loadingHint}>Загрузка пространства…</p>
        ) : showCompanyError ? (
          <p className={styles.errorBanner} role="alert">
            {companyForEditError}
          </p>
        ) : null}

        {(showCompanyForm || showHandoffOrEmptyForm) && (
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <div className={styles.grid}>
              <div className={styles.requestColumn}>
                <SimpleCard
                  key={`request-${cardsKey}`}
                  className={styles.requestCard ?? ""}
                  embedded
                  fields={requestFields}
                  headerAlign="center"
                  hideFooter
                  initialValues={requestInitial}
                  onChange={(data) => {
                    setRequestState({ key: cardsKey, data });
                  }}
                  title="Данные заявки"
                />
                {companySlug ? (
                  <div className={styles.requestActions}>
                    <button
                      type="submit"
                      className={styles.requestSaveBtn}
                      disabled={isRequestSaveDisabled}
                    >
                      {companyStore.isCompanyForEditSaving ? "Сохранение..." : "Сохранить"}
                    </button>
                  </div>
                ) : null}
              </div>

              <div className={styles.adminColumn}>
                <section className={styles.adminListCard}>
                  <div className={styles.adminListHeader}>Администраторы</div>
                  <div className={styles.adminListBody}>
                    <div className={styles.adminListViewport}>
                      {isCompanyAdminsLoading ? (
                        <p className={styles.adminListHint}>Загрузка администраторов…</p>
                      ) : companyAdminsError ? (
                        <p className={styles.adminListError} role="alert">
                          {companyAdminsError}
                        </p>
                      ) : companyAdmins.length === 0 ? (
                        <p className={styles.adminListHint}>
                          Администраторы пространства не найдены
                        </p>
                      ) : (
                        <ul
                          className={styles.adminList}
                          aria-label="Список администраторов пространства"
                        >
                          {companyAdmins.map((admin) => (
                            <li key={admin.id} className={styles.adminListItem}>
                              <span className={styles.adminName}>{admin.name || admin.email}</span>
                              <div className={styles.adminActions}>
                                <button
                                  type="button"
                                  className={styles.adminIconButton}
                                  title="Редактировать администратора"
                                  aria-label="Редактировать администратора"
                                  onClick={() => openEditAdminModal(admin.id)}
                                >
                                  <Image
                                    src={editIcon}
                                    alt=""
                                    aria-hidden="true"
                                    width={23}
                                    height={23}
                                    className={styles.adminIconImage}
                                  />
                                </button>
                                <button
                                  type="button"
                                  className={styles.adminIconButton}
                                  title="Удалить администратора"
                                  aria-label="Удалить администратора"
                                  onClick={() => openDeleteAdminModal(admin.id)}
                                >
                                  <Image
                                    src={deleteIcon}
                                    alt=""
                                    aria-hidden="true"
                                    width={20}
                                    height={22}
                                    className={styles.adminIconImage}
                                  />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      type="button"
                      className={styles.addAdminBtn}
                      onClick={openCreateAdminModal}
                    >
                      Добавить администратора
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </form>
        )}
      </main>

      <Modal
        isOpen={isCreateAdminModalOpen}
        onClose={closeCreateAdminModal}
        showCloseButton={false}
        {...(styles.createAdminModalHost ? { className: styles.createAdminModalHost } : {})}
      >
        <form className={styles.createAdminModal} onSubmit={handleCreateAdminSubmit}>
          <div className={styles.createAdminHeader}>
            <h2 className={styles.createAdminTitle}>Добавить администратора</h2>
          </div>
          <div className={styles.createAdminBody}>
            <div className={styles.createAdminFields}>
              <label className={styles.createAdminField}>
                <span>ФИО*</span>
                <input
                  type="text"
                  required
                  placeholder="Введите фамилию имя отчество"
                  value={newAdminName}
                  onChange={(event) => setNewAdminName(event.target.value)}
                  onBlur={() => setNewAdminTouched((prev) => ({ ...prev, name: true }))}
                />
                {newAdminTouched.name && nameFieldError ? (
                  <span className={styles.createAdminFieldError}>{nameFieldError}</span>
                ) : null}
              </label>

              <label className={styles.createAdminField}>
                <span>Email*</span>
                <input
                  type="email"
                  required
                  placeholder="Введите почту"
                  value={newAdminEmail}
                  onChange={(event) => setNewAdminEmail(event.target.value)}
                  onBlur={() => setNewAdminTouched((prev) => ({ ...prev, email: true }))}
                />
                {newAdminTouched.email && emailFieldError ? (
                  <span className={styles.createAdminFieldError}>{emailFieldError}</span>
                ) : null}
              </label>
            </div>

            {createAdminError ? (
              <p className={styles.createAdminError} role="alert">
                {createAdminError}
              </p>
            ) : null}

            <div className={styles.createAdminActions}>
              <button
                type="button"
                className={styles.createAdminCancel}
                onClick={closeCreateAdminModal}
                disabled={isCreateAdminSubmitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                className={styles.createAdminSubmit}
                disabled={isCreateAdminSubmitting || !isCreateAdminFormValid}
              >
                {isCreateAdminSubmitting ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(adminToEdit)}
        onClose={closeEditAdminModal}
        showCloseButton={false}
        {...(styles.createAdminModalHost ? { className: styles.createAdminModalHost } : {})}
      >
        <form className={styles.createAdminModal} onSubmit={handleEditAdminSubmit}>
          <div className={styles.createAdminHeader}>
            <h2 className={styles.createAdminTitle}>Редактирование данных администратора</h2>
          </div>
          <div className={styles.createAdminBody}>
            <div className={styles.createAdminFields}>
              <label className={styles.createAdminField}>
                <span>ФИО*</span>
                <input
                  type="text"
                  required
                  placeholder="Введите фамилию имя отчество"
                  value={newAdminName}
                  onChange={(event) => setNewAdminName(event.target.value)}
                  onBlur={() => setNewAdminTouched((prev) => ({ ...prev, name: true }))}
                />
                {newAdminTouched.name && nameFieldError ? (
                  <span className={styles.createAdminFieldError}>{nameFieldError}</span>
                ) : null}
              </label>

              <label className={styles.createAdminField}>
                <span>Email*</span>
                <input
                  type="email"
                  required
                  placeholder="Введите почту"
                  value={newAdminEmail}
                  onChange={(event) => setNewAdminEmail(event.target.value)}
                  onBlur={() => setNewAdminTouched((prev) => ({ ...prev, email: true }))}
                />
                {newAdminTouched.email && emailFieldError ? (
                  <span className={styles.createAdminFieldError}>{emailFieldError}</span>
                ) : null}
              </label>
            </div>

            {editAdminError ? (
              <p className={styles.createAdminError} role="alert">
                {editAdminError}
              </p>
            ) : null}

            <div className={styles.createAdminActions}>
              <button
                type="button"
                className={styles.createAdminCancel}
                onClick={closeEditAdminModal}
                disabled={isEditAdminSubmitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                className={styles.createAdminSubmit}
                disabled={isEditAdminSubmitting || !isEditAdminFormValid}
              >
                {isEditAdminSubmitting ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(adminToDelete)}
        onClose={closeDeleteAdminModal}
        showCloseButton={false}
        {...(styles.createAdminModalHost ? { className: styles.createAdminModalHost } : {})}
      >
        <div className={styles.deleteAdminModal}>
          <div className={styles.deleteAdminHeader}>
            <h2 className={styles.createAdminTitle}>Удаление администратора</h2>
          </div>
          <div className={styles.deleteAdminBody}>
            <p className={styles.deleteAdminText}>
              Вы уверены, что хотите удалить?
              <span className={styles.deleteAdminName}>
                {adminToDelete?.name || adminToDelete?.email}
              </span>
            </p>

            {deleteAdminError ? (
              <p className={styles.createAdminError} role="alert">
                {deleteAdminError}
              </p>
            ) : null}

            <div className={styles.createAdminActions}>
              <button
                type="button"
                className={styles.createAdminCancel}
                onClick={closeDeleteAdminModal}
                disabled={isDeleteAdminSubmitting}
              >
                Отмена
              </button>
              <button
                type="button"
                className={styles.createAdminSubmit}
                onClick={() => void handleDeleteAdmin()}
                disabled={isDeleteAdminSubmitting}
              >
                {isDeleteAdminSubmitting ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <footer className={styles.footer}>Сделано в SFERA</footer>
    </div>
  );
}

export default observer(EditSpaceViewComponent);
