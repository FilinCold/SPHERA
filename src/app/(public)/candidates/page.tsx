"use client";

import { CandidateCard } from "@/widgets/CandidateCard";

import styles from "./page.module.scss";

export default function CandidatesPage() {
  return (
    <div className={styles.page}>
      <CandidateCard />
    </div>
  );
}
