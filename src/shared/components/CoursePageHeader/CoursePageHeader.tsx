"use client";

import { useRouter } from "next/navigation";

import styles from "./CoursePageHeader.module.scss";

import type { CoursePageHeaderProps } from "./types";

export const CoursePageHeader = (props: CoursePageHeaderProps) => {
  const { courseId, courseName, lessonStage } = props;
  const router = useRouter();

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.link}
        onClick={() => {
          router.push("/courses");
        }}
      >
        Курсы
      </button>

      <span className={styles.separator}>|</span>

      <button
        type="button"
        className={styles.link}
        onClick={() => {
          if (courseId) {
            router.push(`/course/${courseId}`);
          }
        }}
      >
        {courseName}
      </button>

      <span className={styles.separator}>|</span>

      <span className={`${styles.link} ${styles.current}`}>{lessonStage}</span>
    </div>
  );
};
