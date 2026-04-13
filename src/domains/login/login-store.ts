import { makeAutoObservable } from "mobx";

import type { RootStore } from "@/shared/store";

import type {
  ForgotPasswordErrors,
  ForgotPasswordSteps,
  ForgotPasswordValues,
  LoginFormErrors,
  LoginFormValues,
} from "./model";

export class LoginStore {
  values: LoginFormValues = {
    email: "",
    password: "",
  };

  touched = {
    email: false,
    password: false,
  };

  forgotPasswordSteps: ForgotPasswordSteps = "none";

  forgotPasswordValues: ForgotPasswordValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  forgotPasswordTouched = {
    email: false,
    password: false,
    confirmPassword: false,
  };

  showPassword = false;
  isModalOpen = false;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get errors(): LoginFormErrors {
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

  get isForgotPasswordEmailReady() {
    const email = this.forgotPasswordValues.email;

    return !!email && this.isValidEmail(email);
  }

  get forgotPasswordErrors(): ForgotPasswordErrors {
    return {
      email: !this.forgotPasswordValues.email
        ? "Введите email"
        : !this.isValidEmail(this.forgotPasswordValues.email)
          ? "Введите корректный email"
          : "",

      password:
        this.forgotPasswordValues.password.length < 5
          ? "Минимальная длинна пароля - 5 символов"
          : "",

      confirmPassword:
        this.forgotPasswordValues.password !== this.forgotPasswordValues.confirmPassword
          ? "Пароли не совпадают"
          : "",
    };
  }

  get isForgotPasswordValid() {
    return Object.values(this.forgotPasswordErrors).every((error) => !error);
  }

  private isValidEmail(email: string) {
    const rules = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return rules.test(email);
  }

  setField(field: keyof LoginFormValues, value: string | boolean) {
    this.values[field] = value as never;
  }

  setTouched(field: keyof LoginFormValues) {
    this.touched[field] = true;
  }

  setForgotPasswordField(field: keyof ForgotPasswordValues, value: string) {
    this.forgotPasswordValues[field] = value;
  }

  setForgotPasswordTouched(field: keyof ForgotPasswordValues) {
    this.forgotPasswordTouched[field] = true;
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

  openForgotPassword() {
    this.forgotPasswordSteps = "email";
  }

  closeForgotPassword() {
    this.forgotPasswordSteps = "none";
  }

  submitForgotPasswordEmail() {
    this.forgotPasswordTouched.email = true;

    if (!this.isValidEmail(this.forgotPasswordValues.email)) {
      return;
    }

    this.forgotPasswordSteps = "reset";
  }

  submitForgotPasswordReset() {
    this.forgotPasswordTouched = {
      email: true,
      password: true,
      confirmPassword: true,
    };

    if (this.isForgotPasswordValid) {
      alert("Пароль успешно изменён!");
      this.closeForgotPassword();
    }
  }

  submit() {
    this.touched = {
      email: true,
      password: true,
    };
    if (!this.isValid) {
      return;
    }

    void this.root.auth.login(this.values.email, this.values.password);
  }
}
