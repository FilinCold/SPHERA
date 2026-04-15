import Link from "next/link";

import styles from "./CompanyCard.module.scss";

import type { CompanyCardProps } from "./types";

const CompanyCard = ({
  name,
  subscriptionDate,
  status,
  href = "#",
  target = "_self",
  companyId,
}: CompanyCardProps) => {
  const finalHref = companyId ? `/made-space/${companyId}` : href;

  return (
    <div className={styles.card}>
      <div className={styles.card__left}>
        <h3 className={styles.card__title}>{name}</h3>

        <div className={styles.card__info}>
          <span className={styles.card__label}>Дата подписки до:</span>
          <span className={styles.card__date}>{subscriptionDate || "—"}</span>
        </div>
      </div>

      <div className={styles.card__right}>
        <div
          className={`${styles.status} ${
            status === "active" ? styles["status--active"] : styles["status--inactive"]
          }`}
        >
          <span className={styles.status__dot}></span>
          {status === "active" ? "Активно" : "Приостановлено"}
        </div>

        <Link href={finalHref} target={target} className={styles.card__button}>
          Смотреть
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
