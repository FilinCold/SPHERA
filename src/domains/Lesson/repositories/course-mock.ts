import type { Course } from "../model/course-model";

export const mockCourse: Course = {
  id: "1",
  title: "Основы продаж",
  image: "/course.jpg",
  lessons: [
    {
      id: "1",
      title: "Введение",
      content: "<h1>Введение</h1><p>Первый урок</p>",
      videoUrl: null,
      status: "active",
    },
    {
      id: "2",
      title: "Работа с возражениями",
      content: "<h1>Работа с возражениями</h1>",
      videoUrl: null,
      status: "archived",
    },
  ],
};
