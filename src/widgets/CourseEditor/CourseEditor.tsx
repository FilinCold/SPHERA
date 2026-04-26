"use client";

import Uploady, { useUploady } from "@rpldy/uploady";
import {
  useItemErrorListener,
  useItemFinishListener,
  useItemProgressListener,
} from "@rpldy/uploady";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useRef, useState } from "react";

import type { Lesson } from "@/domains/Lesson/model/lesson-model";
import { CoursePageHeader } from "@/shared/components/CoursePageHeader/CoursePageHeader";
import { LessonEditor } from "@/shared/components/LessonEditor";
import { Modal } from "@/shared/components/MenuItem/Modal";
import { useStores } from "@/shared/store";

import plusImage from "./assets/plus.svg";
import trashcan from "./assets/trashcan.svg";
import styles from "./CourseEditor.module.scss";

const EditorWithUpload = observer(() => {
  const { courseStore } = useStores();
  const uploady = useUploady();
  const cancelUploadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCancelTimer = () => {
    if (cancelUploadTimerRef.current) {
      clearTimeout(cancelUploadTimerRef.current);
      cancelUploadTimerRef.current = null;
    }
  };

  const handleVideoClick = () => {
    courseStore.startUpload();

    const handleWindowFocus = () => {
      cancelUploadTimerRef.current = setTimeout(() => {
        if (courseStore.isUploading && courseStore.uploadProgress === 0) {
          courseStore.cancelUpload();
        }
      }, 500);
    };

    window.addEventListener("focus", handleWindowFocus, { once: true });
    uploady.showFileUpload();
  };

  useItemProgressListener((item) => {
    clearCancelTimer();
    courseStore.setUploadProgress(Math.round(item.completed));
  });

  useItemFinishListener((item) => {
    clearCancelTimer();

    const url = URL.createObjectURL(item.file as File);

    courseStore.finishUpload(url);
  });

  useItemErrorListener(() => {
    clearCancelTimer();
    courseStore.setError("Ошибка загрузки видео");
  });

  return (
    <>
      <CoursePageHeader
        courseName="Основны продаж"
        lessonStage={courseStore.title || "Новый урок"}
      />

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
        <div className={styles.uploadProgress}>Загрузка: {courseStore.uploadProgress}%</div>
      )}

      {courseStore.videoUrl && (
        <video className={styles.video} controls src={courseStore.videoUrl} />
      )}

      {courseStore.error && <div className={styles.error}>{courseStore.error}</div>}

      <div className={styles.actions}>
        <button className={styles.saveButton} onClick={courseStore.saveLesson}>
          Сохранить
        </button>

        <button className={styles.publishButton} onClick={courseStore.publishLesson}>
          Опубликовать
        </button>
      </div>
    </>
  );
});

export const CourseEditor = observer(() => {
  const { courseStore } = useStores();
  const [tempTitle, setTempTitle] = useState("");
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  const closeDeleteModal = () => {
    setLessonToDelete(null);
  };

  const confirmDeleteLesson = () => {
    if (!lessonToDelete) return;

    courseStore.deleteLesson(lessonToDelete.id);
    setLessonToDelete(null);
  };

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
                  <div
                    className={`${styles.status} ${
                      lesson.status === "archived" ? styles.statusArchived : ""
                    }`}
                  >
                    {courseStore.getLessonStatusLabel(lesson.status)}
                  </div>

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
                    setLessonToDelete(lesson);
                  }}
                >
                  <Image src={trashcan} alt="Корзина" width={24} height={24} />
                </button>
              </div>
            );
          })}

          <button className={styles.createButton} onClick={courseStore.createLesson}>
            Создать урок
            <Image src={plusImage} alt="Добавить" width={20} height={20} />
          </button>
        </div>
      </div>

      <Modal isOpen={Boolean(lessonToDelete)} onClose={closeDeleteModal}>
        <div className={styles.deleteModal}>
          <h2 className={styles.deleteModalTitle}>Удаление урока</h2>

          <p className={styles.deleteModalText}>
            Вы уверены, что хотите удалить урок? {lessonToDelete?.title}
          </p>

          <div className={styles.deleteModalActions}>
            <button className={styles.cancelButton} onClick={closeDeleteModal}>
              Отмена
            </button>

            <button className={styles.confirmDeleteButton} onClick={confirmDeleteLesson}>
              Удалить
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
});
