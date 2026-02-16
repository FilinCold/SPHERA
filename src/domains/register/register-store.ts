import { makeAutoObservable } from "mobx";

import type { RootStore } from "@/shared/store";

import type { RegistrationFormErrors, RegistrationFormValues } from "./model";

export class RegisterStore {
  values: RegistrationFormValues = {
    email: "",
    password: "",
  };

  touched = {
    email: false,
    password: false,
  };

  showPassword = false;
  isModalOpen = false;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get errors(): RegistrationFormErrors {
    return {
      email: !this.values.email
        ? "Введите email"
        : !this.isValidEmail(this.values.email)
          ? "Введите корректный email"
          : "",
      password: this.values.password.length < 5 ? "Минимальная длинна пароля - 5 символов" : "",
    };
  }

  get isValid() {
    return Object.values(this.errors).every((error) => !error);
  }

  private isValidEmail(email: string) {
    const rules = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return rules.test(email);
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
      email: true,
      password: true,
    };
    if (this.isValid) {
      alert("Форма успешно отправлена!");
    }
  }
}
