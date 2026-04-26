"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./CandidateProfile.module.scss";

import type { CandidateProfileProps } from "./types";

export const CandidateProfile = (props: CandidateProfileProps) => {
  const { name, profession, avatar, progress, courseInProgress, details, ageLabel, onAddComment } =
    props;
  const [comment, setComment] = useState("");

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <Image src={avatar} alt={name} width={120} height={120} className={styles.avatar} />
        </div>

        <div className={styles.center}>
          <h1 className={styles.profession}>{profession}</h1>

          <p className={styles.name}>{name}</p>
          {ageLabel && <span className={styles.age}> {ageLabel}</span>}

          {details && (
            <>
              <Block title="Дата рождения" text={details.birthDate} />
              <Block title="Образование" text={details.education} />
              <Block title="Опыт работы" text={details.experience} />
              <Block title="Навыки" text={details.skills} />
              <Block title="Личные качества" text={details.personal} />

              <h3 className={styles.commentsTitle}>Комментарии</h3>

              {details.comments.map((c) => (
                <div key={c.id} className={styles.comment}>
                  <b>{c.author}</b>
                  <p>{c.text}</p>
                </div>
              ))}
              <div className={styles.inputWrapper}>
                <textarea
                  className={styles.textarea}
                  maxLength={1000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Оставьте комментарий о кандидате для других пользователей до 1000 символов "
                />

                <button
                  className={styles.save}
                  disabled={!comment.trim()}
                  onClick={() => {
                    onAddComment(comment);
                    setComment("");
                  }}
                >
                  Сохранить
                </button>
              </div>
            </>
          )}
        </div>

        <div className={styles.right}>
          <div className={styles.topRow}>
            <div className={styles.progressBlock}>
              <div className={styles.progressTop}>
                <span>{courseInProgress}</span>
                <span>{progress}%</span>
              </div>

              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className={styles.status}>
              <span className={styles.statusLabel}>Статус</span>
              <select className={styles.select}>
                <option>Не просмотрен</option>
                <option>В работе</option>
                <option>Отказ</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Block = ({ title, text }: { title: string; text: string }) => (
  <div className={styles.block}>
    <b>{title}</b>
    <p>{text}</p>
  </div>
);
