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
        label="Email*"
        placeholder="Введите вашу почту"
        value={register.values.email}
        onChange={(e) => register.setField("email", e.target.value)}
        onBlur={() => register.setTouched("email")}
        error={register.touched.email ? register.errors.email : ""}
      />

      <div className={styles.passwordContainer}>
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
        <Button className={styles.forgotPasswordButton}>Забыли пароль?</Button>
      </div>

      <Button
        className={styles.submitBtn}
        disabled={!register.isValid}
        onClick={(e) => {
          e.preventDefault();
          register.submit();
        }}
      >
        Войти
      </Button>
    </form>
  );
};

export const RegistrationForm = observer(RegistrationFormView);
