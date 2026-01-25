import { makeAutoObservable } from "mobx";

import { UiStore } from "./ui-store";

export class RootStore {
  ui: UiStore;

  constructor() {
    this.ui = new UiStore(this);
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const createRootStore = (): RootStore => new RootStore();
