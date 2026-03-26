export interface CourseCardProps {
  title: string;
  description: string;
  image: string;

  status: "active" | "archived" | "deleted";
  statusLabel: string;

  studentsCount: number;
  avatars: string[];

  date: string;

  onOpen: () => void;
  onCopy: () => void;
}
