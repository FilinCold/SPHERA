import Link from "next/link";

import styles from "./LessonsCard.module.scss";

import type { LessonsCardProps } from "./types";

export const LessonsCard = ({ title, status, href = "#", target = "_self" }: LessonsCardProps) => {
  const isActive = status === "active";
  const statusClass = isActive ? styles["status--active"] : styles["status--inactive"];
  const statusText = isActive ? "Активен" : "Неактивен";

  return (
    <div className={styles.card}>
      <div className={styles.card__left}>
        <h3 className={styles.card__title}>{title || "Без названия"}</h3>

        <div className={`${styles.status} ${statusClass}`}>
          <span className={styles.status__dot}></span>
          {statusText}
        </div>
      </div>

      <div className={styles.card__right}>
        <Link href={href} target={target} className={styles.card__button}>
          Смотреть
        </Link>
      </div>
    </div>
  );
};
