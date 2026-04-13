"use client";

import { observer } from "mobx-react-lite";
import Image from "next/image";

import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input/Input";
import { Modal } from "@/shared/components/Modal";
import { useStores } from "@/shared/store";

import eyeClosed from "./assets/eye-off.svg";
import eyeOpen from "./assets/eye-on.svg";
import styles from "./loginForm.module.scss";

const LoginFormView = () => {
  const { login, auth } = useStores();

  return (
    <>
      <form className={styles.form}>
        <Input
          className={styles.input}
          label="Email*"
          placeholder="Введите вашу почту"
          value={login.values.email}
          onChange={(e) => login.setField("email", e.target.value)}
          onBlur={() => login.setTouched("email")}
          error={login.touched.email ? login.errors.email : ""}
        />

        <div className={styles.passwordContainer}>
          <Input
            className={styles.input}
            label="Пароль*"
            placeholder="Введите пароль"
            type={login.showPassword ? "text" : "password"}
            value={login.values.password}
            onChange={(e) => login.setField("password", e.target.value)}
            onBlur={() => login.setTouched("password")}
            error={login.touched.password ? login.errors.password : ""}
            inputUpgrade={
              <Image
                src={login.showPassword ? eyeOpen : eyeClosed}
                alt="toggle password"
                onClick={login.togglePasswordVisibility}
                className={styles.eyeIcon}
              />
            }
          />
          <Button
            className={styles.forgotPasswordButton}
            onClick={(e) => {
              e.preventDefault();
              login.openForgotPassword();
            }}
          >
            Забыли пароль?
          </Button>
        </div>

        <Button
          className={styles.submitBtn}
          disabled={!login.isValid || auth.isLoading}
          onClick={(e) => {
            e.preventDefault();
            login.submit();
          }}
        >
          {auth.isLoading ? "Вход..." : "Войти"}
        </Button>
        {auth.error ? <p>{auth.error}</p> : null}
      </form>

      <Modal isOpen={login.forgotPasswordSteps === "email"} onClose={login.closeForgotPassword}>
        <div className={styles.modalHeader}>
          <h1 className={styles.modalName}>Введите вашу почту</h1>
        </div>

        <div className={styles.modalBody}>
          <Input
            label="Email*"
            placeholder="Введите вашу почту"
            value={login.forgotPasswordValues.email}
            onChange={(e) => login.setForgotPasswordField("email", e.target.value)}
            onBlur={() => login.setForgotPasswordTouched("email")}
            error={login.forgotPasswordTouched.email ? login.forgotPasswordErrors.email : ""}
            className={styles.input}
          />

          <Button
            className={styles.submitModalBtn}
            disabled={!login.isForgotPasswordEmailReady}
            onClick={login.submitForgotPasswordEmail}
          >
            Сохранить
          </Button>
        </div>
      </Modal>

      <Modal isOpen={login.forgotPasswordSteps === "reset"} onClose={login.closeForgotPassword}>
        <div className={styles.modalHeader}>
          {" "}
          <h1 className={styles.modalName}>Введите новый пароль</h1>
        </div>

        <div className={styles.modalBody}>
          <Input
            label="Email*"
            placeholder="Введите вашу почту"
            value={login.forgotPasswordValues.email}
            onChange={(e) => login.setForgotPasswordField("email", e.target.value)}
            className={styles.input}
          />
          <Input
            label="Новый пароль*"
            placeholder="Придумайте пароль"
            type={login.showPassword ? "text" : "password"}
            value={login.forgotPasswordValues.password}
            onChange={(e) => login.setForgotPasswordField("password", e.target.value)}
            onBlur={() => login.setForgotPasswordTouched("password")}
            className={styles.input}
            error={login.forgotPasswordTouched.password ? login.forgotPasswordErrors.password : ""}
            inputUpgrade={
              <Image
                src={login.showPassword ? eyeOpen : eyeClosed}
                alt="toggle password"
                onClick={login.togglePasswordVisibility}
                className={styles.eyeIcon}
              />
            }
          />
          <Input
            label="Подтвердите пароль*"
            placeholder="Подтвердите пароль"
            type={login.showPassword ? "text" : "password"}
            value={login.forgotPasswordValues.confirmPassword}
            onChange={(e) => login.setForgotPasswordField("confirmPassword", e.target.value)}
            onBlur={() => login.setForgotPasswordTouched("confirmPassword")}
            className={styles.input}
            error={
              login.forgotPasswordTouched.confirmPassword
                ? login.forgotPasswordErrors.confirmPassword
                : ""
            }
            inputUpgrade={
              <Image
                src={login.showPassword ? eyeOpen : eyeClosed}
                alt="toggle password"
                onClick={login.togglePasswordVisibility}
                className={styles.eyeIcon}
              />
            }
          />
          <Button
            className={styles.submitModalBtn}
            disabled={!login.isForgotPasswordValid}
            onClick={login.submitForgotPasswordReset}
          >
            Сохранить
          </Button>
        </div>
      </Modal>
    </>
  );
};

export const LoginForm = observer(LoginFormView);
