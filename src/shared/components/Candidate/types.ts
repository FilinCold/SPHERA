export interface CandidateProps {
  name: string;
  profession: string;
  avatar: string;
  dateOfResponse: string;
  isBookmarked?: boolean;
  progress: number;
  onToggleBookmark: (e: React.MouseEvent<HTMLButtonElement>) => void;
  courseInProgress: string;
}
