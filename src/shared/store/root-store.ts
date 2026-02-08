import { makeAutoObservable } from "mobx";

import { TodoStore } from "./todos-store";
import { UiStore } from "./ui-store";

export class RootStore {
  ui: UiStore;
  todos: TodoStore;

  constructor() {
    this.ui = new UiStore(this);
    this.todos = new TodoStore(this);
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createRootStore = (): RootStore => new RootStore();
