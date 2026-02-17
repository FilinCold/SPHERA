import { makeAutoObservable } from "mobx";

import { LoginStore } from "@/domains/login/login-store";
import { RegisterStore } from "@/domains/register/register-store";

import { UiStore } from "./ui-store";

export class RootStore {
  ui: UiStore;
  login: LoginStore;
  register: RegisterStore;

  constructor() {
    this.ui = new UiStore(this);
    this.login = new LoginStore(this);
    this.register = new RegisterStore(this);
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createRootStore = (): RootStore => new RootStore();
