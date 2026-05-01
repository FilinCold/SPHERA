"use client";

import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useEffect } from "react";

import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input/Input";
import { useStores } from "@/shared/store";

import eyeClosed from "./assets/eye-off.svg";
import eyeOpen from "./assets/eye-on.svg";
import styles from "./RegistrationForm.module.scss";

type RegistrationFormProps = {
  registrationUuid?: string;
};

const RegistrationFormView = ({ registrationUuid }: RegistrationFormProps) => {
  const { register } = useStores();

  useEffect(() => {
    if (!registrationUuid) {
      return;
    }

    void register.loadInvitation(registrationUuid);

    return () => {
      register.resetState();
    };
  }, [register, registrationUuid]);

  if (!registrationUuid) {
    return (
      <p className={styles.errorText}>Ссылка регистрации не содержит идентификатор приглашения.</p>
    );
  }

  if (register.isInvitationLoading) {
    return <p className={styles.stateText}>Загрузка приглашения...</p>;
  }

  const isInvitationNotResolvedYet =
    Boolean(registrationUuid) &&
    !register.invitationEmail &&
    !register.error &&
    !register.isCompleted;

  if (isInvitationNotResolvedYet) {
    return <p className={styles.stateText}>Загрузка приглашения...</p>;
  }

  if (register.isCompleted) {
    return <p className={styles.stateText}>Регистрация завершена. Перенаправляем на вход...</p>;
  }

  if (register.isInvalidInvitation) {
    return (
      <p className={styles.errorText}>
        {register.error ?? "Ссылка недействительна или устарела. Проверьте ссылку приглашения."}
      </p>
    );
  }

  return (
    <form className={styles.form}>
      <Input
        className={styles.input}
        label="Email"
        value={register.invitationEmail}
        disabled
        readOnly
      />

      {!!register.invitationCompanyName && (
        <Input
          className={styles.input}
          label="Пространство"
          value={register.invitationCompanyName}
          disabled
          readOnly
        />
      )}

      <Input
        className={styles.input}
        label="Пароль*"
        placeholder="Введите пароль"
        type={register.showPassword ? "text" : "password"}
        value={register.values.password}
        onChange={(e) => register.setField("password", e.target.value)}
        onBlur={() => register.setTouched("password")}
        error={register.touched.password ? register.errors.password : ""}
        inputUpgrade={
          <Image
            src={register.showPassword ? eyeOpen : eyeClosed}
            alt="toggle password"
            onClick={register.togglePasswordVisibility}
            className={styles.eyeIcon}
          />
        }
      />

      <Input
        className={styles.input}
        label="Подтвердите пароль*"
        placeholder="Подтвердите пароль"
        type={register.showPassword ? "text" : "password"}
        value={register.values.confirmPassword}
        onChange={(e) => register.setField("confirmPassword", e.target.value)}
        onBlur={() => register.setTouched("confirmPassword")}
        error={register.touched.confirmPassword ? register.errors.confirmPassword : ""}
        inputUpgrade={
          <Image
            src={register.showPassword ? eyeOpen : eyeClosed}
            alt="toggle password"
            onClick={register.togglePasswordVisibility}
            className={styles.eyeIcon}
          />
        }
      />

      <Button
        className={styles.submitBtn}
        disabled={!register.isRegistrationFormFilled || !register.isValid || register.isSubmitting}
        onClick={(e) => {
          e.preventDefault();
          void register.submit(registrationUuid);
        }}
      >
        {register.isSubmitting ? "Сохраняем..." : "Завершить регистрацию"}
      </Button>

      {register.error && <p className={styles.errorText}>{register.error}</p>}
    </form>
  );
};

export const RegistrationForm = observer(RegistrationFormView);
