"use client";

import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AdminCard } from "@/shared/components/AdminCard/AdminCard";
import type { AdminField } from "@/shared/components/AdminCard/types";
import { SimpleCard } from "@/shared/components/SimpleCard/SimpleCard";
import type { FormData, InputField } from "@/shared/components/SimpleCard/types";
import TitleBar from "@/shared/components/TitleBar/TitleBar";
import {
  consumeMadeSpaceHandoffFromSession,
  type MadeSpaceHandoffPayload,
  splitFioIntoParts,
} from "@/shared/config/made-space-handoff";
import { PAGES } from "@/shared/config/pages.config";
import { useStores } from "@/shared/store";

import styles from "./page.module.scss";

const adminFields: AdminField[] = [
  {
    name: "firstName",
    label: "Имя",
    placeholder: "Введите имя",
    required: true,
  },
  {
    name: "lastName",
    label: "Фамилия",
    placeholder: "Введите фамилию",
    required: true,
  },
  {
    name: "middleName",
    label: "Отчество",
    placeholder: "Введите отчество",
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
    label: "Имя пространства*",
    placeholder: "Введите имя пространства",
    required: true,
  },
  {
    name: "subscriptionStatus",
    label: "Статус подписки:",
    type: "select",
    required: true,
    skipEmptySelectOption: true,
    selectStatusIndicators: {
      greenWhenValue: "active",
      redWhenValue: "inactive",
    },
    options: [
      { label: "Активно", value: "active" },
      { label: "Приостановлено", value: "inactive" },
    ],
  },
  {
    name: "subscriptionDateRange",
    label: "Дата подписки*",
    type: "dateRange",
    placeholder: "__.__.____",
    required: true,
    dateRangeVariant: "inline",
  },
];

function EditSpaceViewComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");
  const { companyStore } = useStores();

  const [handoff] = useState<MadeSpaceHandoffPayload | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const params = new URLSearchParams(window.location.search);

    if (params.get("companyId")) {
      return null;
    }

    return consumeMadeSpaceHandoffFromSession();
  });

  useEffect(() => {
    if (companyId) {
      void companyStore.loadCompanyForEdit(companyId);
    } else {
      companyStore.clearCompanyForEdit();
    }

    return () => {
      companyStore.clearCompanyForEdit();
    };
  }, [companyId, companyStore]);

  const { companyForEdit, isCompanyForEditLoading, companyForEditError } = companyStore;

  const cardsKey = useMemo(() => {
    if (companyId && companyForEdit) {
      return `company-${companyForEdit.id}`;
    }

    if (handoff) {
      return `handoff-${handoff.email}-${handoff.subscriptionDateRangeStart}`;
    }

    return "empty";
  }, [companyId, companyForEdit, handoff]);

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

    const { firstName, lastName, middleName } = splitFioIntoParts(handoff.fio);

    return {
      firstName,
      lastName,
      middleName,
      email: handoff.email,
    };
  }, [handoff]);

  const requestInitial = useMemo((): Partial<FormData> => {
    if (companyId && companyForEdit) {
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
  }, [companyId, companyForEdit, handoff]);

  const handleToolbarCancel = () => {
    router.push(PAGES.COMPANY_SPACE);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    void new FormData(form);
    // TODO: отправка на API сохранения пространства
  };

  const showCompanyLoading = Boolean(companyId) && isCompanyForEditLoading;
  const showCompanyError =
    Boolean(companyId) && !isCompanyForEditLoading && Boolean(companyForEditError);
  const showCompanyForm =
    Boolean(companyId) &&
    !isCompanyForEditLoading &&
    Boolean(companyForEdit) &&
    !companyForEditError;
  const showHandoffOrEmptyForm = !companyId;

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
              <SimpleCard
                key={`request-${cardsKey}`}
                className={styles.requestCard ?? ""}
                embedded
                fields={requestFields}
                hideFooter
                initialValues={requestInitial}
                title="Данные заявки"
              />

              <div className={styles.adminColumn}>
                <AdminCard
                  key={`admin-${cardsKey}`}
                  className={styles.adminCard ?? ""}
                  fields={adminFields}
                  hideFooter
                  {...(adminInitial !== undefined ? { initialValues: adminInitial } : {})}
                  title="Данные администратора"
                />

                <div className={styles.actions}>
                  <button className={styles.cancelBtn} type="button" onClick={handleToolbarCancel}>
                    Отмена
                  </button>
                  <button className={styles.saveBtn} type="submit">
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
