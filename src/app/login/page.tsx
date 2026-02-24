"use client";

import Image from "next/image";

import { LoginForm } from "@/widgets/LoginForm/loginForm";

import background from "./assets/background-for-reg.svg";
import styles from "./page.module.scss";

export default function RegistrationPage() {
  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <Image src={background} alt="Фон" fill className={styles.background} loading="eager" />
      </div>
      <div className={styles.right}>
        <div className={styles.formWrapper}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
