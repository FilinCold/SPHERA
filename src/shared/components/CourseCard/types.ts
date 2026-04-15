export type CourseStatus = "active" | "archived" | "deleted";

export interface UserAvatar {
  id: number;
  avatar: string;
}

export interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  status: CourseStatus;
  usersCount: number;
  date: string;
  link: string;
  users?: UserAvatar[];
}
