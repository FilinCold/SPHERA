import type { CourseStatus, UserAvatar } from "../types";

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
