"use client";

import { useEffect, useState } from "react";

import styles from "./CourseCard.module.scss";

import type { CourseCardProps } from "./types";

export const CourseCard = ({
  title,
  description,
  image,
  status,
  usersCount,
  date,
  link,
  users = [],
}: CourseCardProps) => {
  const [avatars, setAvatars] = useState(users);

  // 🔌 Заготовка под API (пока отключена)
  /*
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/courses/users`);
        const data = await res.json();
        setAvatars(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchUsers();
  }, []);
  */

  const handleOpenCourse = () => {
    window.location.href = link || "#";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      alert("Ссылка успешно скопирована!");
    } catch {
      alert("Ошибка копирования");
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Активно";
      case "archived":
        return "В архиве";
      case "deleted":
        return "Удалено";
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />

        <div
          className={`${styles.status} ${
            status === "active"
              ? styles.active
              : status === "archived"
                ? styles.archived
                : styles.deleted
          }`}
        >
          {getStatusText()}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>{title}</div>

        <div className={styles.description}>{description}</div>

        <div className={styles.meta}>
          <div className={styles.usersRow}>
            <div className={styles.avatars}>
              {avatars.slice(0, 3).map((user) => (
                <img key={user.id} src={user.avatar} alt="user" className={styles.avatar} />
              ))}
            </div>

            <div className={styles.usersCount}>{usersCount} человек</div>
          </div>

          <div className={styles.date}>{date}</div>
        </div>

        <div className={styles.actions}>
          <button className={`${styles.button} ${styles.primary}`} onClick={handleOpenCourse}>
            Смотреть курс
          </button>

          <button className={`${styles.button} ${styles.secondary}`} onClick={handleCopy}>
            🔗
          </button>
        </div>
      </div>
    </div>
  );
};
