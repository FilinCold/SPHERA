"use client";

import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { CandidateProfile as CandidateProfileView } from "@/shared/components/CandidateProfile";
import { useStores } from "@/shared/store";

export const CandidateProfile = observer(() => {
  const { id } = useParams();
  const { candidateStore } = useStores();

  useEffect(() => {
    candidateStore.getCandidates();
  }, [candidateStore]);

  useEffect(() => {
    if (!id) return;

    const candidate = candidateStore.getCandidateById(id as string);

    if (candidate && !candidate.details) {
      candidateStore.loadCandidateDetails(id as string);
    }
  }, [candidateStore, id, candidateStore.candidates.length]);

  const candidate = candidateStore.getCandidateById(id as string);

  if (!candidate) return <div>Кандидат не найден</div>;

  const getAgeLabel = (age: number): string => {
    if (age % 10 === 1 && age % 100 !== 11) return `${age} год`;

    if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) {
      return `${age} года`;
    }

    return `${age} лет`;
  };

  return (
    <CandidateProfileView
      name={candidate.name}
      profession={candidate.profession}
      avatar={candidate.avatar}
      progress={candidate.progress}
      courseInProgress={candidate.courseInProgress}
      details={candidate.details}
      ageLabel={getAgeLabel(candidate.age)}
      onAddComment={(text: string) => candidateStore.addComment(candidate.id, text)}
    />
  );
});
