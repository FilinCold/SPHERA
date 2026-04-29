import type { CourseStatus, UserAvatar } from "@/shared/components/types";

import type { Course } from "../model/course-model";
import type { Lesson } from "../model/lesson-model";

const COURSES_STORAGE_KEY = "courses";
const DEFAULT_COURSE_IMAGE = "https://picsum.photos/403/300";

const mockUsers: UserAvatar[] = [
  { id: 1, avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, avatar: "https://i.pravatar.cc/150?img=3" },
];

export interface StoredCourse extends Course {
  description: string;
  status: CourseStatus;
  usersCount: number;
  date: string;
  link: string;
  users: UserAvatar[];
  selectedLessonId: string | null;
}

const cloneLesson = (lesson: Lesson): Lesson => ({
  ...lesson,
});

const cloneLessons = (lessons: Lesson[]): Lesson[] => lessons.map(cloneLesson);

const cloneUsers = (users: UserAvatar[]): UserAvatar[] => users.map((user) => ({ ...user }));

const createCourseLink = (courseId: string) => `/course/${courseId}`;

const normalizeLessons = (lessons: unknown): Lesson[] => {
  if (!Array.isArray(lessons)) {
    return [];
  }

  return lessons.map((lesson, index) => {
    const nextLesson = (lesson ?? {}) as Partial<Lesson>;

    return {
      id:
        typeof nextLesson.id === "string" && nextLesson.id ? nextLesson.id : `lesson-${index + 1}`,
      title:
        typeof nextLesson.title === "string" && nextLesson.title.trim()
          ? nextLesson.title
          : "Новый урок",
      content: typeof nextLesson.content === "string" ? nextLesson.content : "",
      videoUrl: typeof nextLesson.videoUrl === "string" ? nextLesson.videoUrl : null,
      status: nextLesson.status === "active" ? "active" : "archived",
    };
  });
};

const normalizeUsers = (users: unknown): UserAvatar[] => {
  if (!Array.isArray(users)) {
    return [];
  }

  return users.flatMap((user) => {
    const nextUser = user as UserAvatar;

    if (
      typeof user !== "object" ||
      user === null ||
      typeof nextUser.id !== "number" ||
      typeof nextUser.avatar !== "string"
    ) {
      return [];
    }

    return [{ id: nextUser.id, avatar: nextUser.avatar }];
  });
};

const normalizeCourse = (course: unknown, index: number): StoredCourse => {
  const nextCourse = (course ?? {}) as Partial<StoredCourse>;
  const id =
    typeof nextCourse.id === "string" && nextCourse.id ? nextCourse.id : `course-${index + 1}`;

  return {
    id,
    title:
      typeof nextCourse.title === "string" && nextCourse.title.trim()
        ? nextCourse.title
        : "Без названия",
    description: typeof nextCourse.description === "string" ? nextCourse.description : "",
    image:
      typeof nextCourse.image === "string" && nextCourse.image
        ? nextCourse.image
        : DEFAULT_COURSE_IMAGE,
    status:
      nextCourse.status === "archived" || nextCourse.status === "deleted"
        ? nextCourse.status
        : "active",
    usersCount: typeof nextCourse.usersCount === "number" ? nextCourse.usersCount : 0,
    date: typeof nextCourse.date === "string" ? nextCourse.date : "",
    link: createCourseLink(id),
    users: normalizeUsers(nextCourse.users),
    lessons: normalizeLessons(nextCourse.lessons),
    selectedLessonId:
      typeof nextCourse.selectedLessonId === "string" ? nextCourse.selectedLessonId : null,
  };
};

const cloneCourse = (course: StoredCourse): StoredCourse => ({
  ...course,
  link: createCourseLink(course.id),
  users: cloneUsers(course.users),
  lessons: cloneLessons(course.lessons),
  selectedLessonId: course.selectedLessonId ?? null,
});

const initialCourses: StoredCourse[] = [
  {
    id: "course-1",
    title: "React с нуля до профи",
    description: "Полный курс по React: хуки, контекст, роутинг, оптимизация",
    image: "https://picsum.photos/id/0/403/300",
    status: "active",
    usersCount: 156,
    date: "15.03.2026",
    link: createCourseLink("course-1"),
    users: cloneUsers(mockUsers),
    lessons: [],
    selectedLessonId: null,
  },
  {
    id: "course-2",
    title: "TypeScript: полное руководство",
    description: "Освойте TypeScript с нуля: типы, дженерики, утилитарные типы",
    image: "https://picsum.photos/id/1/403/300",
    status: "active",
    usersCount: 98,
    date: "22.03.2026",
    link: createCourseLink("course-2"),
    users: cloneUsers(mockUsers),
    lessons: [],
    selectedLessonId: null,
  },
  {
    id: "course-3",
    title: "Next.js для профессионалов",
    description: "Создание серверных приложений, SSR, ISR, API Routes",
    image: "https://picsum.photos/id/2/403/300",
    status: "archived",
    usersCount: 243,
    date: "10.02.2026",
    link: createCourseLink("course-3"),
    users: cloneUsers(mockUsers),
    lessons: [],
    selectedLessonId: null,
  },
  {
    id: "course-4",
    title: "MobX в действии",
    description: "Управление состоянием в React-приложениях с помощью MobX",
    image: "https://picsum.photos/id/3/403/300",
    status: "deleted",
    usersCount: 45,
    date: "05.01.2026",
    link: createCourseLink("course-4"),
    users: cloneUsers(mockUsers),
    lessons: [],
    selectedLessonId: null,
  },
];

export const getInitialCourses = (): StoredCourse[] => initialCourses.map(cloneCourse);

export const loadCourses = (): StoredCourse[] => {
  if (typeof window === "undefined") {
    return getInitialCourses();
  }

  const saved = localStorage.getItem(COURSES_STORAGE_KEY);

  if (!saved) {
    return getInitialCourses();
  }

  try {
    const parsed = JSON.parse(saved);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((course, index) => normalizeCourse(course, index));
    }
  } catch (error) {
    console.error("Failed to parse courses:", error);
  }

  return getInitialCourses();
};

export const saveCourses = (courses: StoredCourse[]) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses.map(cloneCourse)));
};

export const getCourseById = (courseId: string): StoredCourse | null => {
  const course = loadCourses().find((item) => item.id === courseId);

  return course ? cloneCourse(course) : null;
};

export const updateCourseInStorage = (
  courseId: string,
  updater: (course: StoredCourse) => StoredCourse,
): StoredCourse | null => {
  const courses = loadCourses();
  const index = courses.findIndex((course) => course.id === courseId);

  if (index === -1) {
    return null;
  }

  const course = courses[index];

  if (!course) {
    return null;
  }

  const updatedCourse = normalizeCourse(updater(cloneCourse(course)), index);

  courses[index] = updatedCourse;
  saveCourses(courses);

  return cloneCourse(updatedCourse);
};

export const deleteCourseFromStorage = (courseId: string): boolean => {
  const courses = loadCourses();
  const nextCourses = courses.filter((course) => course.id !== courseId);

  if (nextCourses.length === courses.length) {
    return false;
  }

  saveCourses(nextCourses);

  return true;
};
