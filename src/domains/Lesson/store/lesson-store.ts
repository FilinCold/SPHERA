import { makeAutoObservable, runInAction } from "mobx";

import type { RootStore } from "@/shared/store/root-store";

import { lessonRepository } from "../repositories/lesson-repository";

import type { Lesson } from "../model/lesson-model";

export class LessonStore {
  private _content: string = "";
  private _lessons: Lesson[] = [];
  private _isLoading = false;

  private _videoUrl: string | null = null;
  private _isUploading: boolean = false;
  private _uploadProgress: number = 0;
  private _error: string | null = null;

  private _editorKey = 0;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setContent(content: string) {
    this._content = content;
  }

  public setVideo(url: string) {
    this._videoUrl = url;
  }

  public clearVideo() {
    this._videoUrl = null;
    this._uploadProgress = 0;
    this._isUploading = false;
  }

  public startUpload() {
    this._isUploading = true;
    this._uploadProgress = 0;
    this._error = null;
  }

  public setUploadProgress(progress: number) {
    this._uploadProgress = progress;
  }

  public setError(error: string) {
    this._error = error;
    this._isUploading = false;
  }

  public finishUpload(url: string) {
    this._videoUrl = url;
    this._isUploading = false;
    this._uploadProgress = 100;
  }

  public resetEditor() {
    this._content = "";
    this._videoUrl = null;
    this._editorKey++;
  }

  public async saveLesson() {
    this._isLoading = true;

    try {
      const lesson = await lessonRepository.saveLesson(this._content, this._videoUrl);

      runInAction(() => {
        this._lessons.push(lesson);
        this.resetEditor();
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  get content() {
    return this._content;
  }

  get lessons() {
    return this._lessons;
  }

  get isLoading() {
    return this._isLoading;
  }

  get videoUrl() {
    return this._videoUrl;
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

  get editorKey() {
    return this._editorKey;
  }
}
