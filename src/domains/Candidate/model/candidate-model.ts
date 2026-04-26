export type Comment = {
  id: string;
  author: string;
  text: string;
};

export type CandidateDetails = {
  birthDate: string;
  education: string;
  experience: string;
  skills: string;
  personal: string;
  comments: Comment[];
};

export type Candidate = {
  id: string;
  name: string;
  profession: string;
  avatar: string;
  progress: number;
  dateOfResponse: string;
  isBookmarked: boolean;
  courseInProgress: string;
  age: number;
  details?: CandidateDetails;
};

export type CandidateResponse = {
  candidates: Candidate[];
  total: number;
};
