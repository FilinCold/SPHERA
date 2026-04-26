import type { CandidateDetails } from "@/domains/Candidate/model/candidate-model";

export interface CandidateProfileProps {
  name: string;
  profession: string;
  avatar: string;
  progress: number;
  courseInProgress: string;
  details: CandidateDetails | undefined;
  ageLabel?: string;
  onAddComment: (text: string) => void;
}
