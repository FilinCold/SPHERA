import { makeAutoObservable } from "mobx";

import { AuthStore } from "@/domains/auth/auth-store";
import { CandidateStore } from "@/domains/Candidate/store/candidate-store";
import { CompanyStore } from "@/domains/Company/store/company-store";
import { LessonStore } from "@/domains/Lesson/store/lesson-store";
import { LoginStore } from "@/domains/login/login-store";
import { RegisterStore } from "@/domains/register/register-store";
import { StatisticsStore } from "@/domains/Statistics/store/statistics-store";
import { ThemeStore } from "@/domains/Theme/store/theme-store";
import { TodoStore } from "@/domains/Todos/store/todos-store";

export class RootStore {
  theme: ThemeStore;
  auth: AuthStore;
  login: LoginStore;
  register: RegisterStore;
  // Нужен для эталонного понимания написания виджетов и сторов
  todoStore: TodoStore;
  candidateStore: CandidateStore;
  companyStore: CompanyStore;
  statisticsStore: StatisticsStore;
  lessonStore: LessonStore;

  constructor() {
    this.theme = new ThemeStore(this);
    this.auth = new AuthStore(this);
    this.login = new LoginStore(this);
    this.register = new RegisterStore(this);
    this.todoStore = new TodoStore(this);
    this.candidateStore = new CandidateStore(this);
    this.companyStore = new CompanyStore(this);
    this.statisticsStore = new StatisticsStore(this);
    this.lessonStore = new LessonStore(this);

    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createRootStore = (): RootStore => new RootStore();
