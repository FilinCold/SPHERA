export type Candidate = {
  id: string;
  name: string;
  profession: string;
  avatar: string;
  progress: number;
  dateOfResponse: string;
  isBookmarked: boolean;
  courseInProgress: string;
};

export type CandidateResponse = {
  candidates: Candidate[];
  total: number;
};
