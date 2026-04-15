import { makeAutoObservable } from "mobx";

import type { CourseStatus, UserAvatar } from "../types";

export class CourseCardStore {
  avatars: UserAvatar[] = [];

  constructor(users: UserAvatar[] = []) {
    this.avatars = users;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setAvatars(users: UserAvatar[]) {
    this.avatars = users;
  }

  getStatusText(status: CourseStatus) {
    switch (status) {
      case "active":
        return "Активно";
      case "archived":
        return "В архиве";
      case "deleted":
        return "Удалено";
      default:
        return "";
    }
  }
}
