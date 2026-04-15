"use client";

import { useEffect, useState } from "react";

import { LessonsCard } from "@/shared/components/LessonsCard";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";

import styles from "./LessonsPage.module.scss";

type Lesson = {
  id: string;
  title: string;
  status: "active" | "inactive";
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLessons = async () => {
    try {
      setLoading(true);

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
    } catch (error) {
      console.error("Ошибка загрузки уроков:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

      <div className={styles.container}>
        {loading ? (
          <p>Загрузка уроков...</p>
        ) : lessons.length > 0 ? (
          lessons.map((lesson) => (
            <LessonsCard
              key={lesson.id}
              title={lesson.title}
              status={lesson.status}
              href={`/lessons/${lesson.id}`}
            />
          ))
        ) : (
          <p>Уроки не найдены</p>
        )}
      </div>
    </>
  );
}
