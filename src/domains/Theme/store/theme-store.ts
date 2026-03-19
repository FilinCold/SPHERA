import { makeAutoObservable } from "mobx";

import type { RootStore } from "../../../shared/store/root-store";

type ThemePreference = "system" | "light" | "dark";

export class ThemeStore {
  theme: ThemePreference = "system";
  sidebarOpen = false;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTheme(theme: ThemePreference) {
    this.theme = theme;
  }

  toggleSidebar(force?: boolean) {
    this.sidebarOpen = force ?? !this.sidebarOpen;
  }
}
