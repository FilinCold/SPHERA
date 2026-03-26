import Link from "next/link";

import styles from "./CompanyCard.module.scss";

// 🔹 Заглушка API
const getMockCompany = () => ({
  id: "1",
  name: 'ООО "Ромашка"',
  subscriptionDate: "2026-02-18",
});

const CompanyCard = () => {
  const company = getMockCompany();

  // Добавил тип для параметра
  const getStatus = (subscriptionDate: string) => {
    const today = new Date();
    const subscriptionEnd = new Date(subscriptionDate);

    return subscriptionEnd > today ? "Активно" : "Приостановлено";
  };

  const status = getStatus(company.subscriptionDate);
  const formattedDate = new Date(company.subscriptionDate).toLocaleDateString("ru-RU");

  return (
    <div className={styles.card}>
      <div className={styles.card__left}>
        <h3 className={styles.card__title}>{company.name}</h3>

        <div className={styles.card__info}>
          <span className={styles.card__label}>Дата подписки до:</span>
          <span className={styles.card__date}>{formattedDate}</span>
        </div>
      </div>

      <div className={styles.card__right}>
        <div
          className={`${styles.status} ${
            status === "Активно" ? styles["status--active"] : styles["status--inactive"]
          }`}
        >
          <span className={styles.status__dot}></span>
          {status}
        </div>

        <Link href="#" className={styles.card__button}>
          Смотреть
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
