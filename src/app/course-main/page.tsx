"use client";

import { useState, useEffect } from "react";

import { CourseCard } from "@/shared/components/CourseCard/CourseCard";
import style from "@/shared/components/CourseCard/CourseCard.module.scss";
import type { CourseCardProps } from "@/shared/components/CourseCard/types";
import { CoursePopup } from "@/shared/components/CoursePopup/CoursePopup";
import type { CourseData } from "@/shared/components/CoursePopup/type";
import TitleBar from "@/shared/components/TitleBar/TitleBar";
import { Pagination } from "@/widgets/Pagination/Pagination";

type CourseListItem = CourseCardProps & { id: string };

const mockUsers = [
  { id: 1, avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, avatar: "https://i.pravatar.cc/150?img=3" },
];

const getInitialCourses = (): CourseListItem[] => [
  {
    id: "course-1",
    title: "React с нуля до профи",
    description: "Полный курс по React: хуки, контекст, роутинг, оптимизация",
    image: "https://picsum.photos/id/0/403/300",
    status: "active",
    usersCount: 156,
    date: "15.03.2026",
    link: "https://example.com/react-course",
    users: mockUsers,
  },
  {
    id: "course-2",
    title: "TypeScript: полное руководство",
    description: "Освойте TypeScript с нуля: типы, дженерики, утилитарные типы",
    image: "https://picsum.photos/id/1/403/300",
    status: "active",
    usersCount: 98,
    date: "22.03.2026",
    link: "https://example.com/typescript-course",
    users: mockUsers,
  },
  {
    id: "course-3",
    title: "Next.js для профессионалов",
    description: "Создание серверных приложений, SSR, ISR, API Routes",
    image: "https://picsum.photos/id/2/403/300",
    status: "archived",
    usersCount: 243,
    date: "10.02.2026",
    link: "https://example.com/nextjs-course",
    users: mockUsers,
  },
  {
    id: "course-4",
    title: "MobX в действии",
    description: "Управление состоянием в React-приложениях с помощью MobX",
    image: "https://picsum.photos/id/3/403/300",
    status: "deleted",
    usersCount: 45,
    date: "05.01.2026",
    link: "https://example.com/mobx-course",
    users: mockUsers,
  },
];

const loadCourses = (): CourseListItem[] => {
  if (typeof window === "undefined") return getInitialCourses();

  const saved = localStorage.getItem("courses");

  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      console.error("Failed to parse courses:", error);
    }
  }

  return getInitialCourses();
};

const ITEMS_PER_PAGE = 4;

export default function CourseMainPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [courses, setCourses] = useState<CourseListItem[]>(loadCourses);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCourses = courses.slice(startIndex, endIndex);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  const handleCreateCourse = () => {
    setIsPopupOpen(true);
  };

  const handleSaveCourse = (courseData: CourseData) => {
    const newCourse: CourseListItem = {
      id: `course-${Date.now()}`,
      title: courseData.title,
      description: courseData.description,
      image: courseData.coverImage || "https://picsum.photos/403/300",
      status: "active",
      usersCount: 0,
      date: new Date().toLocaleDateString("ru-RU"),
      link: "#",
      users: [],
    };

    setCourses([newCourse, ...courses]);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <TitleBar onCreateClick={handleCreateCourse} />
      <div className={style.list}>
        {currentCourses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            image={course.image}
            status={course.status}
            usersCount={course.usersCount}
            date={course.date}
            link={course.link}
            users={course.users ?? []}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {isPopupOpen && (
        <div className={style.overlay}>
          <CoursePopup onCancel={handleClosePopup} onSave={handleSaveCourse} />
        </div>
      )}
    </>
  );
}
