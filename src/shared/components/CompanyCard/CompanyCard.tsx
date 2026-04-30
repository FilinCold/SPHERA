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
  companySlug,
}: CompanyCardProps) => {
  const editHref =
    companySlug != null && companySlug !== ""
      ? `${PAGES.EDIT_SPACE}?slug=${encodeURIComponent(companySlug)}`
      : href;
  const statisticsHref =
    companySlug != null && companySlug !== ""
      ? `${PAGES.STATISTICS}?slug=${encodeURIComponent(companySlug)}`
      : PAGES.STATISTICS;
  const hasActiveSubscriptionDate =
    status === "active" && Boolean(subscriptionDate) && subscriptionDate !== "—";
  const subscriptionDateText = hasActiveSubscriptionDate ? `- ${subscriptionDate}` : "-";

  return (
    <div className={styles.card}>
      <div
        className={`${styles.status} ${
          status === "active" ? styles["status--active"] : styles["status--inactive"]
        }`}
      >
        {status === "active" ? "Активен" : "Приостановлено"}
      </div>

      <div className={styles.card__main}>
        <div className={styles.card__titleWrap}>
          <h3 className={styles.card__title} title={name ?? ""}>
            {name || "—"}
          </h3>
        </div>

        <div className={styles.card__metaActions}>
          <div className={styles.card__info}>
            <span className={styles.card__label}>Подписка до:</span>
            <span className={styles.card__date}>{subscriptionDateText}</span>
          </div>

          <div className={styles.card__actions}>
            <Link href={editHref} target={target} className={styles.card__button}>
              Редактировать
            </Link>
            <Link href={statisticsHref} target={target} className={styles.card__button}>
              Смотреть
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
