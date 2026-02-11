"use client";
import Image from "next/image";

import { RegistrationForm } from "@/widgets/RegistrationForm/RegistrationForm";

import background from "./assets/background-for-reg.svg";
import styles from "./page.module.scss";

export default function RegistrationPage() {
  return (
    <div className={styles.page}>
      <Image className={styles.background} src={background} alt="Фон" />
      <RegistrationForm />
    </div>
  );
}
