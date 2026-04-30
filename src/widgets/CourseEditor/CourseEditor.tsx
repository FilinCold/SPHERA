"use client";

import Uploady, { useUploady } from "@rpldy/uploady";
import {
  useItemErrorListener,
  useItemFinishListener,
  useItemProgressListener,
} from "@rpldy/uploady";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type RefObject } from "react";

import type { Lesson } from "@/domains/Lesson/model/lesson-model";
import {
  deleteCourseFromStorage,
  updateCourseInStorage,
} from "@/domains/Lesson/repositories/courses-storage";
import { CoursePageHeader } from "@/shared/components/CoursePageHeader/CoursePageHeader";
import { LessonEditor } from "@/shared/components/LessonEditor";
import { Modal } from "@/shared/components/MenuItem/Modal";
import { useStores } from "@/shared/store";

import pen from "./assets/pen.svg";
import plusImage from "./assets/plus.svg";
import trashcan from "./assets/trashcan.svg";
import upload from "./assets/upload.svg";
import styles from "./CourseEditor.module.scss";

import type { CourseEditorProps } from "./types";
import type { CourseEditFormState } from "./types";

const BannerActions = (props: { onEdit: () => void; onDelete: () => void }) => {
  const { onDelete, onEdit } = props;

  return (
    <div className={styles.bannerActions}>
      <button type="button" className={styles.bannerEditButton} onClick={onEdit}>
        <Image src={pen} alt="Удалить курс" width={24} height={24} />
      </button>

      <button type="button" className={styles.bannerDeleteButton} onClick={onDelete}>
        <Image src={trashcan} alt="Удалить курс" width={24} height={24} />
      </button>
    </div>
  );
};

const EditorWithUpload = observer(
  (props: { titleInputRef: RefObject<HTMLInputElement | null> }) => {
    const { titleInputRef } = props;
    const { courseStore } = useStores();
    const uploady = useUploady();
    const cancelUploadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const currentLessonIndex = useMemo(() => {
      if (!courseStore.selectedLesson) {
        return null;
      }

      const index = courseStore.lessons.findIndex(
        (lesson) => lesson.id === courseStore.selectedLesson?.id,
      );

      return index === -1 ? null : index + 1;
    }, [courseStore.lessons, courseStore.selectedLesson]);

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
        <div className={styles.lessonCardHeader}>
          <div className={styles.lessonCardTitleRow}>
            <span className={styles.lessonCardPrefix}>
              {currentLessonIndex ? `Урок ${currentLessonIndex}.` : "Урок"}
            </span>

            <input
              ref={titleInputRef}
              className={styles.titleInput}
              value={courseStore.title}
              onChange={(e) => courseStore.setTitle(e.target.value)}
              placeholder="Название урока"
            />
          </div>
        </div>

        <LessonEditor
          key={courseStore.selectedLesson?.id}
          value={courseStore.content}
          onChange={courseStore.setContent}
          onVideoClick={handleVideoClick}
        />

        {courseStore.isUploading && (
          <div className={styles.uploadProgress}>Загрузка: {courseStore.uploadProgress}%</div>
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
  },
);

export const CourseEditor = observer((props: CourseEditorProps) => {
  const { courseId } = props;
  const { courseStore } = useStores();
  const router = useRouter();
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState(false);
  const [courseEditForm, setCourseEditForm] = useState<CourseEditFormState>({
    title: "",
    description: "",
    coverImage: "",
  });

  useEffect(() => {
    courseStore.openCourse(courseId);
    setLessonToDelete(null);
    setTempTitle("");
    setIsEditCourseModalOpen(false);
    setIsDeleteCourseModalOpen(false);
  }, [courseId, courseStore]);

  const closeDeleteLessonModal = () => {
    setLessonToDelete(null);
  };

  const confirmDeleteLesson = () => {
    if (!lessonToDelete) {
      return;
    }

    courseStore.deleteLesson(lessonToDelete.id);
    setLessonToDelete(null);
  };

  const closeDeleteCourseModal = () => {
    setIsDeleteCourseModalOpen(false);
  };

  const openEditCourseModal = () => {
    setLessonToDelete(null);
    setIsDeleteCourseModalOpen(false);
    setCourseEditForm({
      title: courseStore.courseName,
      description: courseStore.courseDescription,
      coverImage: courseStore.courseImage,
    });
    setIsEditCourseModalOpen(true);
  };

  const closeEditCourseModal = () => {
    setIsEditCourseModalOpen(false);
  };

  const handleCourseEditInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setCourseEditForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCourseCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageUrl = typeof reader.result === "string" ? reader.result : "";

      setCourseEditForm((prevState) => ({
        ...prevState,
        coverImage: imageUrl,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handlePublishCourseChanges = () => {
    const nextTitle = courseEditForm.title.trim();
    const nextDescription = courseEditForm.description.trim();

    if (!nextTitle || !nextDescription) {
      return;
    }

    updateCourseInStorage(courseId, (course) => ({
      ...course,
      title: nextTitle,
      description: nextDescription,
      image: courseEditForm.coverImage || course.image,
    }));

    courseStore.openCourse(courseId);
    setIsEditCourseModalOpen(false);
  };

  const confirmDeleteCourse = () => {
    const deleted = deleteCourseFromStorage(courseId);

    if (deleted) {
      closeDeleteCourseModal();
      router.push("/courses");
    }
  };

  if (courseStore.courseId !== courseId) {
    return null;
  }

  if (!courseStore.hasCourse) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Курс не найден.</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.pageHeader}>
        <CoursePageHeader
          {...(courseStore.courseId ? { courseId: courseStore.courseId } : {})}
          courseName={courseStore.courseName}
          lessonStage={courseStore.title || "Новый урок"}
        />

        <h1 className={styles.pageTitle}>{courseStore.courseName}</h1>
      </section>

      <section className={styles.bannerCard}>
        <div className={styles.bannerMedia}>
          <Image
            src={courseStore.courseImage}
            alt={courseStore.courseName}
            fill
            className={styles.bannerImage}
            unoptimized
          />
          <div className={styles.bannerOverlay} />
        </div>

        <BannerActions
          onEdit={() => {
            openEditCourseModal();
          }}
          onDelete={() => {
            setLessonToDelete(null);
            setIsEditCourseModalOpen(false);
            setIsDeleteCourseModalOpen(true);
          }}
        />

        <div className={styles.bannerMeta}>
          <div className={styles.bannerDate}>{courseStore.courseDate}</div>

          <div className={styles.bannerUsers}>
            <span className={styles.bannerUsersLabel}>Сейчас проходят</span>

            <div className={styles.bannerUsersRow}>
              <div className={styles.bannerAvatars}>
                {courseStore.courseUsers.slice(0, 3).map((user) => (
                  <Image
                    key={user.id}
                    src={user.avatar}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.bannerAvatar}
                    unoptimized
                  />
                ))}
              </div>

              <span className={styles.bannerUsersCount}>
                {courseStore.courseUsersCount} человек
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.left}>
          <Uploady destination={{ url: "/upload" }}>
            <EditorWithUpload titleInputRef={titleInputRef} />
          </Uploady>
        </section>

        <aside className={styles.right}>
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
                    setIsEditCourseModalOpen(false);
                    setIsDeleteCourseModalOpen(false);
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
        </aside>
      </div>

      <Modal
        isOpen={Boolean(lessonToDelete)}
        onClose={closeDeleteLessonModal}
        className={styles.courseModalSurface}
        hideCloseButton
      >
        <div className={styles.deleteModal}>
          <h2 className={styles.deleteModalTitle}>Удаление урока</h2>

          <p className={styles.deleteModalText}>
            Вы уверены, что хотите удалить урок? {lessonToDelete?.title}
          </p>

          <div className={styles.deleteModalActions}>
            <button className={styles.cancelButton} onClick={closeDeleteLessonModal}>
              Отмена
            </button>

            <button className={styles.confirmDeleteButton} onClick={confirmDeleteLesson}>
              Удалить
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditCourseModalOpen}
        onClose={closeEditCourseModal}
        className={styles.courseModalSurface}
        hideCloseButton
      >
        <div className={styles.courseEditModal}>
          <h2 className={styles.courseEditModalTitle}>Редактирование курса</h2>

          <div className={styles.courseEditModalBody}>
            <div className={styles.courseEditField}>
              <label className={styles.courseEditLabel}>Название курса</label>
              <input
                type="text"
                name="title"
                value={courseEditForm.title}
                onChange={handleCourseEditInputChange}
                placeholder="Введите название курса"
                className={styles.courseEditInput}
              />
            </div>

            <div className={styles.courseEditField}>
              <label className={styles.courseEditLabel}>Описание</label>
              <textarea
                name="description"
                value={courseEditForm.description}
                onChange={handleCourseEditInputChange}
                placeholder="Введите описание курса"
                className={styles.courseEditTextarea}
                rows={4}
              />
            </div>

            <div className={styles.courseEditField}>
              <label className={styles.courseEditLabel}>Обложка курса</label>

              <div className={styles.courseEditUpload}>
                <input
                  type="text"
                  value={courseEditForm.coverImage}
                  readOnly
                  placeholder="Добавить обложку курса"
                  className={styles.courseEditUploadInput}
                />

                <label className={styles.courseEditUploadButton}>
                  <Image src={upload} alt="Загрузить изображение" width={24} height={24} />
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.courseEditHiddenFileInput}
                    onChange={handleCourseCoverChange}
                  />
                </label>
              </div>

              <p className={styles.courseEditHint}>Оптимальные размеры 3200 x 410px</p>
            </div>
          </div>

          <div className={styles.courseEditModalActions}>
            <button className={styles.cancelButton} onClick={closeEditCourseModal}>
              Отмена
            </button>

            <button
              className={styles.publishButton}
              onClick={handlePublishCourseChanges}
              disabled={!courseEditForm.title.trim() || !courseEditForm.description.trim()}
            >
              Опубликовать
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteCourseModalOpen}
        onClose={closeDeleteCourseModal}
        className={styles.courseModalSurface}
        hideCloseButton
      >
        <div className={styles.deleteModal}>
          <h2 className={styles.deleteModalTitle}>Удаление курса</h2>

          <p className={styles.deleteModalText}>
            Вы уверены, что хотите удалить курс? {courseStore.courseName}
          </p>

          <div className={styles.deleteModalActions}>
            <button className={styles.cancelButton} onClick={closeDeleteCourseModal}>
              Отмена
            </button>

            <button className={styles.confirmDeleteButton} onClick={confirmDeleteCourse}>
              Удалить
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
});
