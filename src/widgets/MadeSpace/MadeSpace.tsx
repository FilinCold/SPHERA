"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import { SimpleCard } from "@/shared/components/SimpleCard/SimpleCard";
import type { FormData } from "@/shared/components/SimpleCard/types";
import { PAGES } from "@/shared/config/pages.config";
import { useStores } from "@/shared/store";

import styles from "./MadeSpace.module.scss";

const MadeSpaceComponent = () => {
  const { companyStore } = useStores();
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    const name = typeof data.name === "string" ? data.name.trim() : "";

    if (!name) {
      return;
    }

    const ok = await companyStore.createCompany(name);

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
        {companyStore.error ? <p className={styles.errorBanner}>{companyStore.error}</p> : null}

        <SimpleCard
          title="Новое пространство"
          fields={[
            {
              name: "name",
              label: "Имя пространства*",
              placeholder: "Введите имя",
              required: true,
            },
            // Пока не используем: POST /api/v1/companies принимает только `name`; handoff в edit-space отключён.
            // {
            //   name: "fio",
            //   label: "ФИО*",
            //   placeholder: "Введите ФИО",
            //   required: true,
            // },
            // {
            //   name: "email",
            //   label: "Email администратора*",
            //   type: "email",
            //   placeholder: "Введите email",
            //   required: true,
            // },
            // {
            //   name: "subscriptionDateRange",
            //   label: "Дата подписки*",
            //   type: "dateRange",
            //   placeholder: "__.__.____",
            //   required: true,
            // },
          ]}
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
