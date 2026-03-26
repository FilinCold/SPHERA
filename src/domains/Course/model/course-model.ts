export type CourseStatus = "active" | "archived" | "deleted";

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  status: CourseStatus;
  studentsCount: number;
  studentsAvatars: string[];
  courseUrl: string;
}

export interface CourseResponse {
  courses: Course[];
  total: number;
}
