export type LessonStatus = "active" | "archived";

export type Lesson = {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  status: LessonStatus;
};
