"use client";

import styles from "./CoursePageHeader.module.scss";

import type { CoursePageHeaderProps } from "./types";

export const CoursePageHeader = (props: CoursePageHeaderProps) => {
  const { courseName, lessonStage } = props;

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.link}
        onClick={() => {
          console.log("go to /courses");
        }}
      >
        Курсы
      </button>

      <span className={styles.separator}>|</span>

      <button
        type="button"
        className={styles.link}
        onClick={() => {
          console.log("go to /course");
        }}
      >
        {courseName}
      </button>

      <span className={styles.separator}>|</span>

      <button
        type="button"
        className={`${styles.link} ${styles.current}`}
        onClick={() => {
          console.log("go to current lesson");
        }}
      >
        {lessonStage}
      </button>
    </div>
  );
};
