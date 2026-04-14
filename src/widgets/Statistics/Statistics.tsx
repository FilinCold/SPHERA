"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { Chart } from "@/shared/components/Chart";
import { CircularProgress } from "@/shared/components/CircularProgress";
import { useStores } from "@/shared/store";

import styles from "./Statistics.module.scss";

export const StatisticsWidget = observer(() => {
  const { statisticsStore } = useStores();

  useEffect(() => {
    statisticsStore.getStatistics();
  }, [statisticsStore]);

  if (statisticsStore.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!statisticsStore.data) {
    return null;
  }

  const { totalCandidates } = statisticsStore.data;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{statisticsStore.data.courseName}</h2>
      <div className={styles.statWrapper}>
        <div className={styles.card}>
          <div className={styles.totalBlock}>
            <h2 className={styles.total}>{totalCandidates}</h2>
            <p className={styles.totalLabel}>кандидатов</p>
          </div>

          <div className={styles.statsList}>
            {statisticsStore.progressStats.map((item, index) => (
              <CircularProgress
                key={index}
                value={item.value}
                label={item.label}
                count={item.count}
                color={item.color}
              />
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <Chart option={statisticsStore.chartOption} />
        </div>
      </div>
    </div>
  );
});
