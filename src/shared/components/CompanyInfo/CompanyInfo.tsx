"use client";

import styles from "./CompanyInfo.module.scss";

import type { CompanyInfoProps } from "./types";

export const CompanyInfo = (props: CompanyInfoProps) => {
  const { companyName, subscriptionDateFrom, subscriptionDateTo } = props;

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <h2 className={styles.blockName}>Пространство</h2>
        <h1 className={styles.companyName}>{companyName}</h1>
      </div>
      <div className={styles.rightSide}>
        <p className={styles.subsrciption}>
          Сроки подписки: с {subscriptionDateFrom} <br /> до {subscriptionDateTo}
        </p>
      </div>
    </div>
  );
};
