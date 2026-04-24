"use client";

import Uploady, { useUploady } from "@rpldy/uploady";
import {
  useItemProgressListener,
  useItemFinishListener,
  useItemErrorListener,
} from "@rpldy/uploady";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useState } from "react";

import { CoursePageHeader } from "@/shared/components/CoursePageHeader/CoursePageHeader";
import { LessonEditor } from "@/shared/components/LessonEditor";
import { useStores } from "@/shared/store";

import plusImage from "./assets/plus.svg";
import trashcan from "./assets/trashcan.svg";
import styles from "./CourseEditor.module.scss";

const EditorWithUpload = () => {
  const { courseStore } = useStores();
  const uploady = useUploady();

  const handleVideoClick = () => {
    courseStore.startUpload();
    uploady.showFileUpload();
  };

  useItemProgressListener((item) => {
    courseStore.setUploadProgress(item.completed);
  });

  useItemFinishListener((item) => {
    const url = URL.createObjectURL(item.file as File);

    courseStore.finishUpload(url);
  });

  useItemErrorListener(() => {
    courseStore.setError("Ошибка загрузки видео");
  });

  return (
    <>
      <CoursePageHeader lessonStage="Введение" courseName="Основы продаж" />
      <input
        className={styles.titleInput}
        value={courseStore.title}
        onChange={(e) => courseStore.setTitle(e.target.value)}
        placeholder="Название урока"
      />

      <LessonEditor
        key={courseStore.selectedLesson?.id}
        value={courseStore.content}
        onChange={courseStore.setContent}
        onVideoClick={handleVideoClick}
      />

      {courseStore.isUploading && (
        <div className={styles.upload}>Загрузка: {courseStore.uploadProgress}%</div>
      )}

      {courseStore.videoUrl && (
        <video className={styles.video} controls src={courseStore.videoUrl} />
      )}

      {courseStore.error && <div className={styles.error}>{courseStore.error}</div>}

      <button className={styles.saveButton} onClick={courseStore.saveLesson}>
        Сохранить
      </button>
      <button className={styles.publishButton} onClick={courseStore.saveLesson}>
        Опубликовать
      </button>
    </>
  );
};

export const CourseEditor = observer(() => {
  const { courseStore } = useStores();

  const [tempTitle, setTempTitle] = useState("");

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Uploady destination={{ url: "/upload" }}>
            <EditorWithUpload />
          </Uploady>
        </div>

        <div className={styles.right}>
          {courseStore.lessons.map((lesson) => {
            const isEditing = courseStore.editingLessonId === lesson.id;

            return (
              <div
                key={lesson.id}
                className={`${styles.lessonItem} ${
                  courseStore.selectedLesson?.id === lesson.id ? styles.active : ""
                }`}
                onClick={() => {
                  if (!isEditing) {
                    courseStore.selectLesson(lesson.id);
                  }
                }}
              >
                <div className={styles.lessonContent}>
                  <div className={styles.status}>Активен</div>

                  {isEditing ? (
                    <input
                      className={styles.lessonInput}
                      value={tempTitle}
                      autoFocus
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={() => {
                        courseStore.updateLessonTitle(lesson.id, tempTitle);
                        courseStore.stopEditingLesson();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          courseStore.updateLessonTitle(lesson.id, tempTitle);
                          courseStore.stopEditingLesson();
                        }

                        if (e.key === "Escape") {
                          courseStore.stopEditingLesson();
                        }
                      }}
                    />
                  ) : (
                    <div
                      className={styles.lessonTitle}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setTempTitle(lesson.title);
                        courseStore.startEditingLesson(lesson.id);
                      }}
                    >
                      {lesson.title}
                    </div>
                  )}
                </div>

                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    courseStore.deleteLesson(lesson.id);
                  }}
                >
                  <Image src={trashcan} alt="Корзина" width={24} height={24}></Image>
                </button>
              </div>
            );
          })}

          <button className={styles.createButton} onClick={courseStore.createLesson}>
            Создать урок
            <Image src={plusImage} alt="добавить" width={20} height={20}></Image>
          </button>
        </div>
      </div>
    </div>
  );
});
