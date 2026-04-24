import type { Lesson } from "./lesson-model";

export type Course = {
  id: string;
  title: string;
  image: string;
  lessons: Lesson[];
};
