"use client";

import Image from "next/image";

import styles from "./CourseCard.module.scss";

import type { CourseCardProps } from "./types";

export function CourseCard(props: CourseCardProps) {
  const {
    title,
    description,
    image,
    status,
    statusLabel,
    studentsCount,
    avatars,
    date,
    onOpen,
    onCopy,
  } = props;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Image src={image} alt={title} width={400} height={200} className={styles.image} />

        <div className={`${styles.status} ${styles[status]}`}>{statusLabel}</div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>

        <p className={styles.description}>{description}</p>

        <div className={styles.meta}>
          <div className={styles.metaHeader}>
            <span>Сейчас проходят</span>
            <span>{date}</span>
          </div>

          <div className={styles.users}>
            {avatars.map((avatar, index) => (
              <Image
                key={index}
                src={avatar}
                alt="user avatar"
                width={32}
                height={32}
                className={styles.avatar}
              />
            ))}
          </div>

          <div className={styles.count}>{studentsCount} человек</div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.openButton} onClick={onOpen}>
          Смотреть курс
        </button>

        <button className={styles.copyButton} onClick={onCopy}></button>
      </div>
    </div>
  );
}
