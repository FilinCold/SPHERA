export interface CandidateProps {
  name: string;
  profession: string;
  avatar: string;
  dateOfResponse: string;
  isBookmarked?: boolean;
  progress: number;
  onToggleBookmark: () => void;
  courseInProgress: string;
}
