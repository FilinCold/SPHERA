import Image from "next/image";

import { RegistrationForm } from "@/widgets/RegistrationForm/RegistrationForm";

import background from "../assets/background-for-reg.svg";
import styles from "../page.module.scss";

type RegistrationByUuidPageProps = {
  params: Promise<{
    registrationUuid: string;
  }>;
};

export default async function RegistrationByUuidPage(props: RegistrationByUuidPageProps) {
  const { registrationUuid } = await props.params;

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <Image src={background} alt="Фон" fill className={styles.background} loading="eager" />
      </div>
      <div className={styles.right}>
        <div className={styles.formWrapper}>
          <RegistrationForm registrationUuid={registrationUuid} />
        </div>
      </div>
    </div>
  );
}
