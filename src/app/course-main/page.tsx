"use client";

import { useState } from "react";

import { CourseCard } from "@/shared/components/CourseCard/CourseCard";
import style from "@/shared/components/CourseCard/CourseCard.module.scss";
import type { CourseCardProps } from "@/shared/components/CourseCard/types";
import { CoursePopup } from "@/shared/components/CoursePopup/CoursePopup";
import type { CourseData } from "@/shared/components/CoursePopup/type";
import TitleBar from "@/shared/components/TitleBar/TitleBar";

type CourseListItem = CourseCardProps & { id: string };

const mockUsers = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

const initialCourses: CourseListItem[] = Array.from({ length: 4 }, (_, index) => ({
  id: `course-${index + 1}`,
  title: "Супер курс",
  description: "Lorem ipsum dolor sit amet...",
  image: "https://picsum.photos/403/300",
  status: "active" as const,
  usersCount: 89,
  date: "20.02.2026",
  link: "#",
  users: mockUsers,
}));

export default function CourseMainPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [courses, setCourses] = useState<CourseListItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCourses = localStorage.getItem("courses");

      if (savedCourses) {
        return JSON.parse(savedCourses);
      }
    }

    return initialCourses;
  });

  const handleCreateCourse = () => {
    setIsPopupOpen(true);
  };

  const handleSaveCourse = (courseData: CourseData) => {
    const newCourse: CourseListItem = {
      id: `course-${Date.now()}`,
      title: courseData.title,
      description: courseData.description,
      image: courseData.coverImage || "https://picsum.photos/403/300",
      status: "active" as const,
      usersCount: 0,
      date: new Date().toLocaleDateString("ru-RU"),
      link: "#",
      users: [],
    };

    const updatedCourses = [newCourse, ...courses];

    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <TitleBar onCreateClick={handleCreateCourse} />
      <div className={style.list}>
        {courses.map(({ id, ...course }) => (
          <CourseCard key={id} {...course} />
        ))}
      </div>

      {isPopupOpen && (
        <div className={style.overlay}>
          <CoursePopup onCancel={handleClosePopup} onSave={handleSaveCourse} />
        </div>
      )}
    </>
  );
}
