"use client";

import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ruDateToIsoDate } from "@/domains/Company/lib/ru-date-to-iso";
import type { CreateCompanySubscriptionPayload } from "@/domains/Company/model/company-model";
import { AdminCard } from "@/shared/components/AdminCard/AdminCard";
import type { AdminField } from "@/shared/components/AdminCard/types";
import { SimpleCard } from "@/shared/components/SimpleCard/SimpleCard";
import type { FormData, InputField } from "@/shared/components/SimpleCard/types";
import TitleBar from "@/shared/components/TitleBar/TitleBar";
import {
  consumeMadeSpaceHandoffFromSession,
  type MadeSpaceHandoffPayload,
} from "@/shared/config/made-space-handoff";
import { PAGES } from "@/shared/config/pages.config";
import { useStores } from "@/shared/store";

import styles from "./page.module.scss";

const adminFields: AdminField[] = [
  {
    name: "fio",
    label: "ФИО",
    placeholder: "Введите фамилию имя отчество",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Введите почту",
    required: true,
  },
];

const requestFields: InputField[] = [
  {
    name: "spaceName",
    label: "Имя компании*",
    placeholder: "Введите имя компании",
    required: true,
  },
  {
    name: "subscriptionStatus",
    label: "Статус подписки",
    type: "select",
    required: true,
    skipEmptySelectOption: true,
    options: [
      { label: "Активно", value: "active" },
      { label: "Приостановлено", value: "inactive" },
    ],
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
  fio: string;
  email: string;
};

type KeyedState<T> = {
  key: string;
  data: T;
};

const normalizeString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

function EditSpaceViewComponent() {
  const router = useRouter();
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
    } else {
      companyStore.clearCompanyForEdit();
    }

    return () => {
      companyStore.clearCompanyForEdit();
    };
  }, [companySlug, companyStore]);

  const { companyForEdit, isCompanyForEditLoading, companyForEditError } = companyStore;

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

  const adminInitial = useMemo((): Record<string, string> | undefined => {
    if (!handoff) {
      return undefined;
    }

    return {
      fio: handoff.fio,
      email: handoff.email,
    };
  }, [handoff]);

  const requestInitial = useMemo((): Partial<FormData> => {
    if (companySlug && companyForEdit) {
      const c = companyForEdit;
      const endRaw =
        c.subscriptionDateRangeEnd ?? (c.subscriptionDate !== "—" ? c.subscriptionDate : "");
      const startRaw = c.subscriptionDateRangeStart ?? endRaw;

      return {
        spaceName: c.name.trim(),
        subscriptionStatus: c.status,
        subscriptionDateRangeStart: startRaw,
        subscriptionDateRangeEnd: endRaw,
      };
    }

    const base: Partial<FormData> = {
      subscriptionStatus: "active",
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
  const [adminState, setAdminState] = useState<KeyedState<Record<string, string>>>(() => ({
    key: cardsKey,
    data: adminInitial ?? {},
  }));
  const saveHintContextKey = `${companySlug ?? "new"}:${companyForEdit?.id ?? "none"}`;
  const [saveHintState, setSaveHintState] = useState<{ key: string; message: string | null }>(
    () => ({
      key: saveHintContextKey,
      message: null,
    }),
  );

  const requestCurrent = useMemo(
    () => (requestState.key === cardsKey ? requestState.data : requestInitial),
    [requestState, cardsKey, requestInitial],
  );
  const adminCurrent = useMemo(
    () => (adminState.key === cardsKey ? adminState.data : (adminInitial ?? {})),
    [adminState, cardsKey, adminInitial],
  );
  const saveHint = saveHintState.key === saveHintContextKey ? saveHintState.message : null;

  const setScopedSaveHint = (message: string | null) => {
    setSaveHintState({ key: saveHintContextKey, message });
  };

  const initialSnapshot = useMemo<EditSpaceSnapshot>(() => {
    const request = requestInitial;
    const admin = adminInitial ?? {};

    return {
      spaceName: normalizeString(request.spaceName),
      subscriptionStatus: normalizeString(request.subscriptionStatus),
      subscriptionDateRangeStart: normalizeString(request.subscriptionDateRangeStart),
      subscriptionDateRangeEnd: normalizeString(request.subscriptionDateRangeEnd),
      fio: normalizeString(admin.fio),
      email: normalizeString(admin.email),
    };
  }, [requestInitial, adminInitial]);

  const currentSnapshot = useMemo<EditSpaceSnapshot>(() => {
    const request = { ...requestInitial, ...requestCurrent };
    const admin = { ...(adminInitial ?? {}), ...adminCurrent };

    return {
      spaceName: normalizeString(request.spaceName),
      subscriptionStatus: normalizeString(request.subscriptionStatus),
      subscriptionDateRangeStart: normalizeString(request.subscriptionDateRangeStart),
      subscriptionDateRangeEnd: normalizeString(request.subscriptionDateRangeEnd),
      fio: normalizeString(admin.fio),
      email: normalizeString(admin.email),
    };
  }, [requestInitial, requestCurrent, adminInitial, adminCurrent]);

  const hasChanges =
    currentSnapshot.spaceName !== initialSnapshot.spaceName ||
    currentSnapshot.subscriptionStatus !== initialSnapshot.subscriptionStatus ||
    currentSnapshot.subscriptionDateRangeStart !== initialSnapshot.subscriptionDateRangeStart ||
    currentSnapshot.subscriptionDateRangeEnd !== initialSnapshot.subscriptionDateRangeEnd ||
    currentSnapshot.fio !== initialSnapshot.fio ||
    currentSnapshot.email !== initialSnapshot.email;

  const isSaveDisabled =
    !hasChanges || isCompanyForEditLoading || companyStore.isCompanyForEditSaving || !companySlug;

  const handleToolbarCancel = () => {
    router.push(PAGES.COMPANY_SPACE);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    if (!companySlug || !companyForEdit || !hasChanges) {
      return;
    }

    setScopedSaveHint(null);

    const initialStartIso = ruDateToIsoDate(initialSnapshot.subscriptionDateRangeStart) ?? "";
    const initialEndIso = ruDateToIsoDate(initialSnapshot.subscriptionDateRangeEnd) ?? "";
    const currentStartIso = ruDateToIsoDate(currentSnapshot.subscriptionDateRangeStart) ?? "";
    const currentEndIso = ruDateToIsoDate(currentSnapshot.subscriptionDateRangeEnd) ?? "";
    const datesChanged = currentStartIso !== initialStartIso || currentEndIso !== initialEndIso;

    let subscriptionPost: CreateCompanySubscriptionPayload | undefined;

    if (datesChanged) {
      const startDate = ruDateToIsoDate(currentSnapshot.subscriptionDateRangeStart);
      const endDate = ruDateToIsoDate(currentSnapshot.subscriptionDateRangeEnd);

      if (!startDate || !endDate) {
        setScopedSaveHint("Укажите даты подписки в формате ДД.ММ.ГГГГ");

        return;
      }

      /** POST `/api/v1/companies/{slug}/subscriptions/` — только дата, без времени. */
      subscriptionPost = { start_date: startDate, end_date: endDate };
    }

    const nameChanged = currentSnapshot.spaceName !== initialSnapshot.spaceName;

    if (!nameChanged && !subscriptionPost) {
      setScopedSaveHint("На сервер сохраняются имя пространства и период подписки");

      return;
    }

    const ok = await companyStore.saveEditSpace({
      slug: companySlug,
      ...(nameChanged
        ? {
            companyPatch: {
              name: currentSnapshot.spaceName,
              description: companyForEdit.description ?? "",
            },
          }
        : {}),
      ...(subscriptionPost ? { subscriptionPost } : {}),
    });

    if (!ok && !companyStore.companyForEditError) {
      setScopedSaveHint("Не удалось сохранить изменения");
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
        ) : saveHint ? (
          <p className={styles.errorBanner} role="alert">
            {saveHint}
          </p>
        ) : null}

        {(showCompanyForm || showHandoffOrEmptyForm) && (
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <div className={styles.grid}>
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

              <div className={styles.adminColumn}>
                <AdminCard
                  key={`admin-${cardsKey}`}
                  className={styles.adminCard ?? ""}
                  fields={adminFields}
                  hideFooter
                  singleColumn
                  onChange={(data) => {
                    setAdminState({ key: cardsKey, data });
                  }}
                  {...(adminInitial !== undefined ? { initialValues: adminInitial } : {})}
                  title="Данные администратора"
                />

                <div className={styles.actions}>
                  <button className={styles.cancelBtn} type="button" onClick={handleToolbarCancel}>
                    Отмена
                  </button>
                  <button className={styles.saveBtn} type="submit" disabled={isSaveDisabled}>
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>

      <footer className={styles.footer}>Сделано в SFERA</footer>
    </div>
  );
}

export default observer(EditSpaceViewComponent);
