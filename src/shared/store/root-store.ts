import { makeAutoObservable } from "mobx";

import { LoginStore } from "@/domains/login/login-store";
import { RegisterStore } from "@/domains/register/register-store";
import { ThemeStore } from "@/domains/Theme/store/theme-store";
import { TodoStore } from "@/domains/Todos/store/todos-store";

import { CourseStore } from "./../../domains/Course/store/course-store";

export class RootStore {
  theme: ThemeStore;
  login: LoginStore;
  register: RegisterStore;
  // Нужен для эталонного понимания написания виджетов и сторов
  todoStore: TodoStore;
  courseStore: CourseStore;

  constructor() {
    this.theme = new ThemeStore(this);
    this.login = new LoginStore(this);
    this.register = new RegisterStore(this);
    this.todoStore = new TodoStore(this);
    this.courseStore = new CourseStore(this);

    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createRootStore = (): RootStore => new RootStore();
