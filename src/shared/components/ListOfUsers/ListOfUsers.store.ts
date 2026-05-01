import { makeAutoObservable } from "mobx";

import type { User } from "./types";

export class ListOfUsersStore {
  users: User[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setUsers(nextUsers: User[]) {
    this.users = nextUsers;
  }

  deleteUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }

  addUser(payload: { fullName: string; email: string; role: string }) {
    const fullName = payload.fullName.trim();
    const email = payload.email.trim();

    if (!fullName || !email) {
      return;
    }

    this.users = [
      {
        id: `temp-${Date.now()}`,
        fullName,
        email,
        role: payload.role,
        status: "active",
      },
      ...this.users,
    ];
  }

  updateUser() {
    this.users = [...this.users];
  }
}
