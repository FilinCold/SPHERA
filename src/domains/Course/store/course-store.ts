import { makeAutoObservable, runInAction } from "mobx";

import type { RootStore } from "@/shared/store/root-store";

import { courseRepository } from "../repositories/course-repository";

import type { Course } from "../model/course-model";

export class CourseStore {
  private _courses: Course[] = [];
  private _isLoading = false;
  private _error: string | null = null;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public async getCourses() {
    this._isLoading = true;
    this._error = null;

    try {
      const courses = await courseRepository.getCourses();

      runInAction(() => {
        this._courses = courses;
      });
    } catch (error) {
      runInAction(() => {
        this._error = error instanceof Error ? error.message : "Ошибка загрузки курсов";
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  get courses() {
    return this._courses;
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }
}
