import { makeAutoObservable } from "mobx";

import type { RootStore } from "@/shared/store";

import type { RegistrationFormErrors, RegistrationFormValues } from "./model";

export class RegisterStore {
  values: RegistrationFormValues = {
    name: "",
    password: "",
    confirmPassword: "",
  };
  touched = {
    name: false,
    password: false,
    confirmPassword: false,
  };

  showPassword = false;
  isModalOpen = false;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get errors(): RegistrationFormErrors {
    return {
      name: !this.values.name
        ? "Введите ваше ФИО"
        : !this.isValidName(this.values.name)
          ? "Введите ФИО полностью"
          : "",

      password: this.values.password.length < 5 ? "Минимальная длина пароля - 5 символов" : "",

      confirmPassword:
        this.values.confirmPassword !== this.values.password ? "Пароли не совпадают" : "",
    };
  }

  get isValid() {
    return Object.values(this.errors).every((error) => !error);
  }

  private isValidName(name: string) {
    const rules = /^\S+\s+\S+\s+\S+$/;

    return rules.test(name);
  }

  setField(field: keyof RegistrationFormValues, value: string | boolean) {
    this.values[field] = value as never;
  }

  setTouched(field: keyof RegistrationFormValues) {
    this.touched[field] = true;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submit() {
    this.touched = {
      name: true,
      password: true,
      confirmPassword: true,
    };

    if (this.isValid) {
      alert("Форма успешно отправлена!");
    }
  }
}
