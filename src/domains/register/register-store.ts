import { makeAutoObservable } from "mobx";

import { PAGES } from "@/shared/config/pages.config";
import type { RootStore } from "@/shared/store";

import { RegisterRepository } from "./repository";

import type { RegistrationFormErrors, RegistrationFormValues } from "./model";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const INVALID_INVITE_MARKERS = ["недействитель", "устарел", "некорректн", "not found"];

export class RegisterStore {
  values: RegistrationFormValues = {
    password: "",
    confirmPassword: "",
  };
  touched = {
    password: false,
    confirmPassword: false,
  };

  showPassword = false;
  isModalOpen = false;
  invitationEmail = "";
  invitationRole = "";
  invitationCompanyName = "";
  registrationUuid: string | null = null;
  isInvitationLoading = false;
  isSubmitting = false;
  error: string | null = null;
  isCompleted = false;
  isInvalidInvitation = false;

  private readonly repository = new RegisterRepository();

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get errors(): RegistrationFormErrors {
    return {
      password: this.values.password.length < 8 ? "Минимальная длина пароля - 8 символов" : "",

      confirmPassword:
        this.values.confirmPassword !== this.values.password ? "Пароли не совпадают" : "",
    };
  }

  get isValid() {
    return Object.values(this.errors).every((error) => !error);
  }

  get isRegistrationFormFilled() {
    return (
      this.invitationEmail.trim().length > 0 &&
      this.values.password.trim().length > 0 &&
      this.values.confirmPassword.trim().length > 0
    );
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

  async loadInvitation(registrationUuid: string) {
    if (!UUID_REGEX.test(registrationUuid)) {
      this.error = "Некорректная ссылка приглашения";
      this.isInvitationLoading = false;
      this.isInvalidInvitation = true;

      return;
    }

    if (this.registrationUuid === registrationUuid && this.invitationEmail) {
      return;
    }

    this.registrationUuid = registrationUuid;
    this.isInvitationLoading = true;
    this.error = null;
    this.isCompleted = false;
    this.isInvalidInvitation = false;

    try {
      const invite = await this.repository.fetchInvitation(registrationUuid);

      this.invitationEmail = invite.email;
      this.invitationRole = invite.role;
      this.invitationCompanyName = invite.companyName;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось загрузить приглашение";

      this.error = message;
      this.isInvalidInvitation = INVALID_INVITE_MARKERS.some((marker) =>
        message.toLowerCase().includes(marker),
      );
    } finally {
      this.isInvitationLoading = false;
    }
  }

  resetState() {
    this.values = {
      password: "",
      confirmPassword: "",
    };
    this.touched = {
      password: false,
      confirmPassword: false,
    };
    this.showPassword = false;
    this.invitationEmail = "";
    this.invitationRole = "";
    this.invitationCompanyName = "";
    this.registrationUuid = null;
    this.isInvitationLoading = false;
    this.isSubmitting = false;
    this.error = null;
    this.isCompleted = false;
    this.isInvalidInvitation = false;
  }

  async submit(registrationUuid: string) {
    this.touched = {
      password: true,
      confirmPassword: true,
    };

    if (!this.isRegistrationFormFilled || !this.isValid) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    try {
      await this.repository.completeRegistration(registrationUuid, {
        password: this.values.password,
        repeatPassword: this.values.confirmPassword,
      });
      this.isCompleted = true;
      void this.root.auth.logout();
      if (typeof window !== "undefined") {
        window.location.assign(PAGES.LOGIN);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось завершить регистрацию";

      this.error = message;
      this.isInvalidInvitation = INVALID_INVITE_MARKERS.some((marker) =>
        message.toLowerCase().includes(marker),
      );
    } finally {
      this.isSubmitting = false;
    }
  }
}
