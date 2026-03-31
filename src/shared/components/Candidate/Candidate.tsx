"use client";

import Image from "next/image";

import { Button } from "../Button";

import bookmarkButton from "./assets/star.svg";
import styles from "./Candidate.module.scss";

import type { CandidateProps } from "./types";

export const Candidate = ({
  name,
  profession,
  avatar,
  progress,
  dateOfResponse,
  isBookmarked,
  onToggleBookmark,
  courseInProgress,
}: CandidateProps) => {
  return (
    <div className={styles.candidateBlock}>
      <div className={styles.profilePic}>
        <Image src={avatar} alt={name} width={102} height={102} className={styles.avatar} />
      </div>

      <div className={styles.info}>
        <p className={styles.profession}>{profession}</p>
        <p className={styles.name}>{name}</p>
        <p className={styles.date}>Откликнулся {dateOfResponse}</p>
      </div>

      <div className={styles.progressBlock}>
        <div className={styles.progressInfo}>
          <p className={styles.courseName}>{courseInProgress}</p>
          <span className={styles.progressPercent}>{progress}%</span>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.bookmarkBlock}>
        <Button
          className={`${styles.bookmark} ${isBookmarked ? styles.active : ""}`}
          onClick={onToggleBookmark}
        >
          <Image src={bookmarkButton} alt="Добавить в закладки"></Image>
        </Button>
      </div>
    </div>
  );
};
