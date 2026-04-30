"use client";

import { useEffect, useState } from "react";

import {
  loadCourses,
  saveCourses,
  type StoredCourse,
} from "@/domains/Lesson/repositories/courses-storage";
import { CourseCard } from "@/shared/components/CourseCard/CourseCard";
import style from "@/shared/components/CourseCard/CourseCard.module.scss";
import { CoursePopup } from "@/shared/components/CoursePopup/CoursePopup";
import type { CourseData } from "@/shared/components/CoursePopup/type";
import TitleBar from "@/shared/components/TitleBar/TitleBar";
import { Pagination } from "@/widgets/Pagination/Pagination";

const ITEMS_PER_PAGE = 4;

export function CourseMainPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [courses, setCourses] = useState<StoredCourse[]>(loadCourses);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCourses = courses.slice(startIndex, endIndex);

  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  const handleCreateCourse = () => {
    setIsPopupOpen(true);
  };

  const handleSaveCourse = (courseData: CourseData) => {
    const id = `course-${Date.now()}`;
    const newCourse: StoredCourse = {
      id,
      title: courseData.title,
      description: courseData.description,
      image: courseData.coverImage || "https://picsum.photos/403/300",
      status: "active",
      usersCount: 0,
      date: new Date().toLocaleDateString("ru-RU"),
      link: `/course/${id}`,
      users: [],
      lessons: [],
      selectedLessonId: null,
    };

    setCourses((prevCourses) => [newCourse, ...prevCourses]);
    setIsPopupOpen(false);
    setCurrentPage(1);
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
            users={course.users}
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

export default CourseMainPage;
