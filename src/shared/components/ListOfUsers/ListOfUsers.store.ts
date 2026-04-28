import { makeAutoObservable } from "mobx";

import type { User } from "./types";

const USERS_STORAGE_KEY = "users-list-store";

const createMockUsers = (): User[] =>
  Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    fullName: "Иванов Иван Иванович",
    email: "ivanovbest1990@yande.ru",
    role: "Администратор",
    status: Math.random() > 0.5 ? "active" : "blocked",
  }));

export class ListOfUsersStore {
  users: User[] = [];
  private nextId = 1;

  constructor() {
    this.users = this.loadUsers();
    this.nextId = this.users.length + 1;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  deleteUser(id: number) {
    this.users = this.users.filter((user) => user.id !== id);
    this.saveUsers();
  }

  addUser(payload: { fullName: string; email: string; role: string }) {
    const fullName = payload.fullName.trim();
    const email = payload.email.trim();

    if (!fullName || !email) {
      return;
    }

    this.users = [
      {
        id: this.nextId,
        fullName,
        email,
        role: payload.role,
        status: "active",
      },
      ...this.users,
    ];
    this.nextId += 1;
    this.saveUsers();
  }

  updateUser() {
    this.saveUsers();
  }

  private loadUsers(): User[] {
    if (typeof window === "undefined") {
      return createMockUsers();
    }

    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);

    if (!raw) {
      const fallbackUsers = createMockUsers();

      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(fallbackUsers));

      return fallbackUsers;
    }

    try {
      const parsed = JSON.parse(raw) as User[];

      if (!Array.isArray(parsed)) {
        const fallbackUsers = createMockUsers();

        window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(fallbackUsers));

        return fallbackUsers;
      }

      return parsed;
    } catch {
      const fallbackUsers = createMockUsers();

      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(fallbackUsers));

      return fallbackUsers;
    }
  }

  private saveUsers() {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
  }
}
