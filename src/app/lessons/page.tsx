"use client";

import { useEffect, useState } from "react";

import { LessonsCard } from "@/shared/components/LessonsCard/LessonsCard";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";

type Lesson = {
  id: string;
  title: string;
  status: "active" | "inactive";
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await new Promise<{ data: Lesson[] }>((resolve) => {
          setTimeout(() => {
            resolve({
              data: [
                { id: "1", title: "Введение", status: "active" },
                { id: "2", title: "Основы", status: "inactive" },
                { id: "3", title: "Продвинутый уровень", status: "active" },
              ],
            });
          }, 500);
        });

        setLessons(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return (
    <>
      <SearchBar
        title="Уроки"
        searchPlaceholder="Поиск уроков"
        buttonText="Добавить урок"
        buttonLink="/lessons/create"
      />

      <div>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <LessonsCard key={i} title="Загрузка..." status="inactive" href="#" />
            ))
          : lessons.map((lesson) => (
              <LessonsCard
                key={lesson.id}
                title={lesson.title}
                status={lesson.status}
                href={`/lessons/${lesson.id}`}
              />
            ))}
      </div>
    </>
  );
}
