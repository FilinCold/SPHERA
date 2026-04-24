"use client";

import styles from "./CoursePageHeader.module.scss";

import type { CoursePageHeaderProps } from "./types";

export const CoursePageHeader = (props: CoursePageHeaderProps) => {
  const { courseName, lessonStage } = props;

  return (
    <div className={styles.container}>
      <div className={styles.courseSteps}>
        <h2>Курсы</h2>
        <h2>{courseName}</h2>
        <h2>{lessonStage}</h2>
      </div>
      <h1 className={styles.courseNameBig}>{courseName}</h1>
    </div>
  );
};
