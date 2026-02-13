import { makeAutoObservable, runInAction } from "mobx";

import { restProviderInstance } from "../api/restProviderInstance";

import type { RootStore } from "./root-store";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export class TodoStore {
  todos: Todo[] = [];
  isLoading = false;
  error: string | null = null;
  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchTodos() {
    this.isLoading = true;
    this.error = null;

    try {
      const data = await restProviderInstance.get<Todo[]>("/todos");

      runInAction(() => {
        this.todos = data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Неизвестная ошибка";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}
