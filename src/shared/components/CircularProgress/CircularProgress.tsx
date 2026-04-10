"use client";

import styles from "./CircularProgress.module.scss";

import type { CircularProgressProps } from "./types";

export const CircularProgress = ({
  value,
  label,
  count,
  color = "#1e90ff",
}: CircularProgressProps) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={styles.wrapper}>
      <div className={styles.circle}>
        <svg width="60" height="60">
          <circle className={styles.bg} cx="30" cy="30" r={radius} />

          <circle
            className={styles.progress}
            cx="30"
            cy="30"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ stroke: color }}
          />
        </svg>

        <span className={styles.percent}>{value}%</span>
      </div>

      <div className={styles.info}>
        <p className={styles.label}>{label}</p>
        {count !== undefined && <span className={styles.count}>{count} откликов</span>}
      </div>
    </div>
  );
};
