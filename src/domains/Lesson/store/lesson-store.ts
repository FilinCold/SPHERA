import { makeAutoObservable, runInAction } from "mobx";

import type { RootStore } from "@/shared/store/root-store";

import { lessonRepository } from "../repositories/lesson-repository";

import type { Lesson } from "../model/lesson-model";

export class LessonStore {
  private _content: string = "";
  private _lessons: Lesson[] = [];
  private _isLoading = false;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setContent(content: string) {
    this._content = content;
  }

  public async saveLesson() {
    this._isLoading = true;

    try {
      const lesson = await lessonRepository.saveLesson(this._content);

      runInAction(() => {
        this._lessons.push(lesson);
        this._content = "";
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
}
