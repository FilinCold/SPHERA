import Link from "next/link";

import { PAGES } from "@/shared/config/pages.config";

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
  const finalHref =
    companyId != null && companyId !== ""
      ? `${PAGES.EDIT_SPACE}?companyId=${encodeURIComponent(companyId)}`
      : href;

  return (
    <div className={styles.card}>
      <div className={styles.card__left}>
        <div className={styles.card__titleWrap}>
          <h3 className={styles.card__title} title={name}>
            {name}
          </h3>
        </div>

        <div className={styles.card__info}>
          <span className={styles.card__label}>Дата подписки до:</span>
          <span className={styles.card__date}>{subscriptionDate || "—"}</span>
        </div>

        <div
          className={`${styles.status} ${
            status === "active" ? styles["status--active"] : styles["status--inactive"]
          }`}
        >
          {status === "active" ? "Активен" : "Приостановлено"}
        </div>
      </div>

      <div className={styles.card__right}>
        <Link href={finalHref} target={target} className={styles.card__button}>
          Смотреть
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
