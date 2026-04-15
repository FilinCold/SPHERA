import { makeAutoObservable } from "mobx";

export class PopupCardStore {
  isOpen = false;
  role = "admin";
  fio = "";
  email = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  setRole(value: string) {
    this.role = value;
  }

  setFio(value: string) {
    this.fio = value;
  }

  setEmail(value: string) {
    this.email = value;
  }

  resetForm() {
    this.role = "admin";
    this.fio = "";
    this.email = "";
  }
}
