import { autorun, makeAutoObservable, runInAction } from "mobx";

import type { UserAvatar } from "@/shared/components/types";
import type { RootStore } from "@/shared/store/root-store";

import { courseRepository } from "../repositories/course-repository";
import { getCourseById, updateCourseInStorage } from "../repositories/courses-storage";

import type { Lesson } from "../model/lesson-model";

const DEFAULT_LESSON_TITLE = "Новый урок";

const cloneLesson = (lesson: Lesson): Lesson => ({
  ...lesson,
});

export class CourseStore {
  private _courseId: string | null = null;
  private _courseName = "";
  private _courseDescription = "";
  private _courseImage = "";
  private _courseDate = "";
  private _courseUsersCount = 0;
  private _courseUsers: UserAvatar[] = [];
  private _hasCourse = false;

  private _lessons: Lesson[] = [];
  private _selectedLessonId: string | null = null;

  private _content = "";
  private _title = "";
  private _videoUrl: string | null = null;

  private _isLoading = false;

  private _editingLessonId: string | null = null;

  private _isUploading = false;
  private _uploadProgress = 0;
  private _error: string | null = null;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });

    if (typeof window !== "undefined") {
      autorun(() => {
        if (!this._courseId || !this._hasCourse) {
          return;
        }

        updateCourseInStorage(this._courseId, (course) => ({
          ...course,
          lessons: this._lessons.map(cloneLesson),
          selectedLessonId: this._selectedLessonId,
        }));
      });
    }
  }

  private syncSelectedLessonState() {
    const selected = this.selectedLesson;

    this._content = selected?.content ?? "";
    this._videoUrl = selected?.videoUrl ?? null;
    this._title = selected?.title ?? "";
  }

  public openCourse(courseId: string) {
    const course = getCourseById(courseId);

    this._courseId = courseId;
    this._editingLessonId = null;
    this._isUploading = false;
    this._uploadProgress = 0;
    this._error = null;

    if (!course) {
      this._hasCourse = false;
      this._courseName = "";
      this._courseDescription = "";
      this._courseImage = "";
      this._courseDate = "";
      this._courseUsersCount = 0;
      this._courseUsers = [];
      this._lessons = [];
      this._selectedLessonId = null;
      this._content = "";
      this._title = "";
      this._videoUrl = null;

      return;
    }

    this._hasCourse = true;
    this._courseName = course.title;
    this._courseDescription = course.description;
    this._courseImage = course.image;
    this._courseDate = course.date;
    this._courseUsersCount = course.usersCount;
    this._courseUsers = course.users.map((user) => ({ ...user }));
    this._lessons = course.lessons.map(cloneLesson);

    const hasSavedSelection =
      typeof course.selectedLessonId === "string" &&
      this._lessons.some((lesson) => lesson.id === course.selectedLessonId);

    this._selectedLessonId = hasSavedSelection
      ? course.selectedLessonId
      : (this._lessons[0]?.id ?? null);

    this.syncSelectedLessonState();
  }

  get selectedLesson() {
    return this._lessons.find((lesson) => lesson.id === this._selectedLessonId) || null;
  }

  public selectLesson(id: string) {
    const lesson = this._lessons.find((item) => item.id === id);

    if (!lesson) {
      return;
    }

    this._selectedLessonId = id;
    this.syncSelectedLessonState();
  }

  public createLesson() {
    if (!this._hasCourse) {
      return;
    }

    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: DEFAULT_LESSON_TITLE,
      content: "",
      videoUrl: null,
      status: "archived",
    };

    this._lessons.push(newLesson);
    this.selectLesson(newLesson.id);
  }

  public deleteLesson(id: string) {
    this._lessons = this._lessons.filter((lesson) => lesson.id !== id);

    if (this._editingLessonId === id) {
      this._editingLessonId = null;
    }

    if (this._selectedLessonId === id) {
      const nextLesson = this._lessons[0];

      if (nextLesson) {
        this.selectLesson(nextLesson.id);
      } else {
        this._selectedLessonId = null;
        this._content = "";
        this._title = "";
        this._videoUrl = null;
      }
    }
  }

  public setContent(content: string) {
    this._content = content;
  }

  public setTitle(title: string) {
    this._title = title;
  }

  public updateLessonTitle(id: string, title: string) {
    const lesson = this._lessons.find((item) => item.id === id);

    if (!lesson) {
      return;
    }

    const nextTitle = title.trim() || DEFAULT_LESSON_TITLE;

    lesson.title = nextTitle;

    if (this._selectedLessonId === id) {
      this._title = nextTitle;
    }
  }

  public startEditingLesson(id: string) {
    this._editingLessonId = id;
  }

  public stopEditingLesson() {
    this._editingLessonId = null;
  }

  public async saveLesson() {
    if (!this._selectedLessonId || !this._hasCourse) {
      return;
    }

    this._isLoading = true;

    try {
      const currentLesson = this.selectedLesson;

      const lesson: Lesson = {
        id: this._selectedLessonId,
        title: this._title.trim() || DEFAULT_LESSON_TITLE,
        content: this._content,
        videoUrl: this._videoUrl,
        status: currentLesson?.status ?? "archived",
      };

      const updated = await courseRepository.saveLesson(lesson);

      runInAction(() => {
        const index = this._lessons.findIndex((item) => item.id === this._selectedLessonId);

        if (index !== -1) {
          this._lessons[index] = updated;
          this._title = updated.title;
        }
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  public async publishLesson() {
    if (!this._selectedLessonId || !this._hasCourse) {
      return;
    }

    this._isLoading = true;

    try {
      const lesson: Lesson = {
        id: this._selectedLessonId,
        title: this._title.trim() || DEFAULT_LESSON_TITLE,
        content: this._content,
        videoUrl: this._videoUrl,
        status: "active",
      };

      const updated = await courseRepository.saveLesson(lesson);

      runInAction(() => {
        const index = this._lessons.findIndex((item) => item.id === this._selectedLessonId);

        if (index !== -1) {
          this._lessons[index] = updated;
          this._title = updated.title;
        }
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  public startUpload() {
    this._isUploading = true;
    this._uploadProgress = 0;
    this._error = null;
  }

  public cancelUpload() {
    this._isUploading = false;
    this._uploadProgress = 0;
  }

  public setUploadProgress(progress: number) {
    this._uploadProgress = progress;
  }

  public finishUpload(url: string) {
    this._videoUrl = url;
    this._isUploading = false;
    this._uploadProgress = 100;
  }

  public setError(error: string) {
    this._error = error;
    this._isUploading = false;
  }

  public getLessonStatusLabel(status: "active" | "archived") {
    return status === "active" ? "Активен" : "Архив";
  }

  get courseId() {
    return this._courseId;
  }

  get courseName() {
    return this._courseName;
  }

  get courseDescription() {
    return this._courseDescription;
  }

  get courseImage() {
    return this._courseImage;
  }

  get courseDate() {
    return this._courseDate;
  }

  get courseUsersCount() {
    return this._courseUsersCount;
  }

  get courseUsers() {
    return this._courseUsers;
  }

  get hasCourse() {
    return this._hasCourse;
  }

  get lessons() {
    return this._lessons;
  }

  get content() {
    return this._content;
  }

  get title() {
    return this._title;
  }

  get videoUrl() {
    return this._videoUrl;
  }

  get isLoading() {
    return this._isLoading;
  }

  get isUploading() {
    return this._isUploading;
  }

  get uploadProgress() {
    return this._uploadProgress;
  }

  get error() {
    return this._error;
  }

  get editingLessonId() {
    return this._editingLessonId;
  }
}
