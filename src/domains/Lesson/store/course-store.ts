import { makeAutoObservable, runInAction, autorun } from "mobx";

import type { RootStore } from "@/shared/store/root-store";

import { courseRepository } from "../repositories/course-repository";

import type { Lesson } from "../model/lesson-model";

const STORAGE_KEY = "course-editor";

export class CourseStore {
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

    this.loadFromStorage();

    const firstLesson = this._lessons[0];

    if (firstLesson) {
      this.selectLesson(firstLesson.id);
    }

    if (typeof window !== "undefined") {
      autorun(() => {
        const data = {
          lessons: this._lessons,
          selectedLessonId: this._selectedLessonId,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      });
    }
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return;

    try {
      const data = JSON.parse(raw);

      this._lessons = data.lessons || [];
      this._selectedLessonId = data.selectedLessonId || null;

      const selected = this.selectedLesson;

      if (selected) {
        this._content = selected.content;
        this._videoUrl = selected.videoUrl;
        this._title = selected.title;
      }
    } catch {
      console.error("Ошибка чтения localStorage");
    }
  }

  get selectedLesson() {
    return this._lessons.find((l) => l.id === this._selectedLessonId) || null;
  }

  public selectLesson(id: string) {
    const lesson = this._lessons.find((l) => l.id === id);

    if (!lesson) return;

    this._selectedLessonId = id;
    this._content = lesson.content;
    this._videoUrl = lesson.videoUrl;
    this._title = lesson.title;
  }

  public createLesson() {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "Новый урок",
      content: "",
      videoUrl: null,
    };

    this._lessons.push(newLesson);
    this.selectLesson(newLesson.id);
  }

  public deleteLesson(id: string) {
    this._lessons = this._lessons.filter((l) => l.id !== id);

    if (this._selectedLessonId === id) {
      const next = this._lessons[0];

      if (next) {
        this.selectLesson(next.id);
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
    const lesson = this._lessons.find((l) => l.id === id);

    if (!lesson) return;

    lesson.title = title;
  }

  public startEditingLesson(id: string) {
    this._editingLessonId = id;
  }

  public stopEditingLesson() {
    this._editingLessonId = null;
  }

  public async saveLesson() {
    if (!this._selectedLessonId) return;

    this._isLoading = true;

    try {
      const lesson: Lesson = {
        id: this._selectedLessonId,
        title: this._title,
        content: this._content,
        videoUrl: this._videoUrl,
      };

      const updated = await courseRepository.saveLesson(lesson);

      runInAction(() => {
        const index = this._lessons.findIndex((l) => l.id === this._selectedLessonId);

        if (index !== -1) {
          this._lessons[index] = updated;
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
