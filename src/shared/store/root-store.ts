import { makeAutoObservable } from "mobx";

import { LoginStore } from "@/domains/login/login-store";
import { RegisterStore } from "@/domains/register/register-store";
import { TodoStore } from "./todos-store";
import { UiStore } from "./ui-store";

export class RootStore {
  ui: UiStore;
  login: LoginStore;
  register: RegisterStore;
  todos: TodoStore;

  constructor() {
    this.ui = new UiStore(this);
    this.login = new LoginStore(this);
    this.register = new RegisterStore(this);
    this.todos = new TodoStore(this);

    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createRootStore = (): RootStore => new RootStore();