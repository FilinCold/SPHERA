"use client";

import { observer } from "mobx-react-lite";
import Image from "next/image";

import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input/Input";
import { useStores } from "@/shared/store";

import eyeClosed from "./assets/eye-off.svg";
import eyeOpen from "./assets/eye-on.svg";
import styles from "./RegistrationForm.module.scss";

const RegistrationFormView = () => {
  const { register } = useStores();

  return (
    <form className={styles.form}>
      <Input
        className={styles.input}
        label="ФИО*"
        placeholder="Введите ваше ФИО"
        value={register.values.name}
        onChange={(e) => register.setField("name", e.target.value)}
        onBlur={() => register.setTouched("name")}
        error={register.touched.name ? register.errors.name : ""}
      />

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
        disabled={!register.isValid}
        onClick={(e) => {
          e.preventDefault();
          register.submit();
        }}
      >
        Завершить регистрацию
      </Button>
    </form>
  );
};

export const RegistrationForm = observer(RegistrationFormView);
