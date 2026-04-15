import Link from "next/link";

import styles from "./LessonsCard.module.scss";

import type { LessonsCardProps } from "./types";

export const LessonsCard = ({ title, status, href, target = "_self" }: LessonsCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__left}>
        <h3 className={styles.card__title}>{title}</h3>
      </div>

      <div className={styles.card__right}>
        <div
          className={`${styles.status} ${
            status === "active" ? styles["status--active"] : styles["status--inactive"]
          }`}
        >
          <span className={styles.status__dot}></span>
          {status === "active" ? "Активно" : "Неактивно"}
        </div>

        <Link href={href} target={target} className={styles.card__button}>
          Смотреть
        </Link>
      </div>
    </div>
  );
};
