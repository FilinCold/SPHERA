"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Candidate } from "@/shared/components/Candidate";
import { useStores } from "@/shared/store";

import styles from "./CandidateCard.module.scss";

export const CandidateCard = observer(() => {
  const { candidateStore } = useStores();
  const router = useRouter();

  useEffect(() => {
    candidateStore.getCandidates();
  }, [candidateStore]);

  if (candidateStore.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (candidateStore.error) {
    return <div>Ошибка: {candidateStore.error}</div>;
  }

  return (
    <div className={styles.block}>
      {candidateStore.candidates.map((candidate) => (
        <div
          key={candidate.id}
          onClick={() => router.push(`/candidates/${candidate.id}`)}
          style={{ cursor: "pointer" }}
        >
          <Candidate
            name={candidate.name}
            profession={candidate.profession}
            avatar={candidate.avatar}
            progress={candidate.progress}
            dateOfResponse={candidate.dateOfResponse}
            isBookmarked={candidate.isBookmarked}
            courseInProgress={candidate.courseInProgress}
            onToggleBookmark={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              candidateStore.toggleBookmark(candidate.id);
            }}
          />
        </div>
      ))}
    </div>
  );
});
