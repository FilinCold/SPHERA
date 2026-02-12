"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Button } from "@/shared/components/Button";
import { Checkbox } from "@/shared/components/Checkbox/Checkbox";
import { Input } from "@/shared/components/Input/Input";
import { Modal } from "@/shared/components/Modal";

import eyeClosed from "./assets/eye-off.svg";
import eyeOpen from "./assets/eye-on.svg";
import styles from "./RegistrationForm.module.scss";

import type { RegistrationFormValues, RegistrationFormErrors } from "./types";
import type { ChangeEvent, FocusEvent } from "react";

export function RegistrationForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState<RegistrationFormValues>({
    name: "",
    password: "",
    confirmPassword: "",
    checkAgreement: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState({
    name: false,
    password: false,
    confirmPassword: false,
    checkAgreement: false,
  });

  const errors = useMemo<RegistrationFormErrors>(() => {
    return {
      name: !values.name ? "Введите ФИО" : "",
      password: values.password.length < 5 ? "Минимальная длинна пароля - 5 символов" : "",
      confirmPassword:
        values.password !== values.confirmPassword ? "Введенные пароли не совпадают" : "",
      checkAgreement: !values.checkAgreement
        ? "Подтвердите согласие на обработку перс. данных"
        : "",
    };
  }, [values]);

  const isValid = useMemo(() => {
    return Object.values(errors).every((error) => !error);
  }, [errors]);

  function handleChange<K extends keyof RegistrationFormValues>(field: K) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = field === "checkAgreement" ? event.target.checked : event.target.value;

      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (field === "checkAgreement") {
        setTouched((prev) => ({
          ...prev,
          checkAgreement: true,
        }));
      }
    };
  }

  function handleBlur<K extends keyof typeof touched>(field: K) {
    return (_event: FocusEvent<HTMLInputElement>) => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
    };
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  function handleSubmit() {
    setTouched({
      name: true,
      password: true,
      confirmPassword: true,
      checkAgreement: true,
    });

    if (!isValid) return;
    alert("Форма успешно отправлена!");
  }

  return (
    <form className={styles.form}>
      <Input
        className={styles.input}
        label="ФИО"
        placeholder="Ваше Фамилия Имя Отчество"
        value={values.name}
        onChange={handleChange("name")}
        onBlur={handleBlur("name")}
        error={touched.name ? errors.name : ""}
      />

      <Input
        className={styles.input}
        label="Придумайте пароль"
        placeholder="Придумайте пароль"
        type={showPassword ? "text" : "password"}
        value={values.password}
        onChange={handleChange("password")}
        onBlur={handleBlur("password")}
        error={touched.password ? errors.password : ""}
        inputUpgrade={
          <Image
            src={showPassword ? eyeOpen : eyeClosed}
            alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
            onClick={togglePasswordVisibility}
            className={styles.eyeIcon}
          />
        }
      />

      <Input
        className={styles.input}
        label="Подтвердите пароль"
        placeholder="Подтвердите пароль"
        type={showPassword ? "text" : "password"}
        value={values.confirmPassword}
        onChange={handleChange("confirmPassword")}
        onBlur={handleBlur("confirmPassword")}
        error={touched.confirmPassword ? errors.confirmPassword : ""}
        inputUpgrade={
          <Image
            src={showPassword ? eyeOpen : eyeClosed}
            alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
            onClick={togglePasswordVisibility}
            className={styles.eyeIcon}
          />
        }
      />

      <Checkbox
        checked={values.checkAgreement}
        onChange={handleChange("checkAgreement")}
        error={touched.checkAgreement ? errors.checkAgreement : ""}
        label={
          <div className={styles.checkboxLabelWrapper}>
            <span className={styles.labelText}>Я даю своё согласие на обработку</span>
            <Button
              className={styles.linkButton}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              персональных данных
            </Button>
          </div>
        }
      />

      <Button className={styles.submitBtn} disabled={!isValid} onClick={handleSubmit}>
        Зарегистрироваться
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        Вы предоставляете нам ваши персональные данные
      </Modal>
    </form>
  );
}
