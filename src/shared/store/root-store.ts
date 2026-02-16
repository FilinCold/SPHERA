import { makeAutoObservable } from "mobx";

import { RegisterStore } from "@/domains/register/register-store";

import { UiStore } from "./ui-store";

export class RootStore {
  ui: UiStore;
  register: RegisterStore;

  constructor() {
    this.ui = new UiStore(this);
    this.register = new RegisterStore(this);
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createRootStore = (): RootStore => new RootStore();
