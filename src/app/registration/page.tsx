"use client";

import Image from "next/image";

import { StoreProvider } from "@/shared/store";
import { RegistrationForm } from "@/widgets/RegistrationForm/RegistrationForm";

import background from "./assets/background-for-reg.svg";
import styles from "./page.module.scss";

export default function RegistrationPage() {
  return (
    <StoreProvider>
      <div className={styles.page}>
        <div className={styles.left}>
          <Image src={background} alt="Фон" fill className={styles.background} loading="eager" />
        </div>
        <div className={styles.right}>
          <div className={styles.formWrapper}>
            <RegistrationForm />
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}
