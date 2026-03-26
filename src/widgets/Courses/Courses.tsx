"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { CourseCard } from "@/shared/components/CourseCard";
import { useStores } from "@/shared/store";

export const Courses = observer(() => {
  const { courseStore } = useStores();
  const router = useRouter();

  useEffect(() => {
    courseStore.getCourses();
  }, [courseStore]);

  if (courseStore.isLoading) {
    return <div>Загрузка...</div>;
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Активный";
      case "archived":
        return "В архиве";
      case "deleted":
        return "Удалён";
      default:
        return "";
    }
  };

  return (
    <div>
      {courseStore.courses.map((course) => (
        <CourseCard
          key={course.id}
          title={course.title}
          description={course.description}
          image={course.image}
          status={course.status}
          statusLabel={getStatusLabel(course.status)}
          studentsCount={course.studentsCount}
          avatars={course.studentsAvatars.slice(0, 3)}
          date={new Date().toLocaleDateString()}
          onOpen={() => router.push(course.courseUrl)}
          onCopy={() => navigator.clipboard.writeText(course.courseUrl)}
        />
      ))}
    </div>
  );
});
