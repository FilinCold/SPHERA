"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ruDateToIsoDate } from "@/domains/Company/lib/ru-date-to-iso";
import { SimpleCard } from "@/shared/components/SimpleCard/SimpleCard";
import type { FormData } from "@/shared/components/SimpleCard/types";
import { PAGES } from "@/shared/config/pages.config";
import { useStores } from "@/shared/store";

import styles from "./MadeSpace.module.scss";

const SIMPLE_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MadeSpaceComponent = () => {
  const { companyStore } = useStores();
  const router = useRouter();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const adminFullName = typeof data.adminFullName === "string" ? data.adminFullName.trim() : "";
    const adminEmail = typeof data.adminEmail === "string" ? data.adminEmail.trim() : "";
    const subscriptionDateStart =
      typeof data.subscriptionDateStart === "string" ? data.subscriptionDateStart.trim() : "";
    const subscriptionDateEnd =
      typeof data.subscriptionDateEnd === "string" ? data.subscriptionDateEnd.trim() : "";

    if (!name || !adminFullName || !adminEmail || !subscriptionDateStart || !subscriptionDateEnd) {
      setLocalError("Заполните все обязательные поля");

      return;
    }

    if (!SIMPLE_EMAIL_RE.test(adminEmail)) {
      setLocalError("Введите корректный email администратора");

      return;
    }

    const startDateIso = ruDateToIsoDate(subscriptionDateStart);
    const endDateIso = ruDateToIsoDate(subscriptionDateEnd);

    if (!startDateIso || !endDateIso) {
      setLocalError("Укажите даты подписки в формате ДД.ММ.ГГГГ");

      return;
    }

    setLocalError(null);
    const ok = await companyStore.createCompanyWithSetup({
      name,
      adminFullName,
      adminEmail,
      subscriptionStartDate: startDateIso,
      subscriptionEndDate: endDateIso,
    });

    if (ok) {
      router.push(PAGES.COMPANY_SPACE);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.titleSection}>
        <h1 className={styles.title}>Создание пространства</h1>
      </section>

      <section className={styles.content}>
        {localError ? <p className={styles.errorBanner}>{localError}</p> : null}
        {!localError && companyStore.error ? (
          <p className={styles.errorBanner}>{companyStore.error}</p>
        ) : null}

        <SimpleCard
          title="Новое пространство"
          fields={[
            {
              name: "name",
              label: "Название *",
              placeholder: "Введите название пространства",
              required: true,
            },
            {
              name: "adminFullName",
              label: "ФИО администратора *",
              placeholder: "Введите фамилию имя отчество",
              required: true,
            },
            {
              name: "adminEmail",
              label: "Email администратора *",
              type: "email",
              pattern: SIMPLE_EMAIL_RE.source,
              placeholder: "Введите почту",
              required: true,
            },
            {
              name: "subscriptionDate",
              label: "Дата подписки",
              type: "dateRange",
              placeholder: "__.__.____",
              required: true,
            },
          ]}
          submitLabel="Сохранить"
          submitDisabled={companyStore.isCreating}
          onCancel={() => {
            router.push(PAGES.COMPANY_SPACE);
          }}
          onSubmit={(data) => void handleSubmit(data)}
        />
      </section>

      <footer className={styles.footer}>Сделано в SFERA</footer>
    </main>
  );
};

export const MadeSpace = observer(MadeSpaceComponent);
