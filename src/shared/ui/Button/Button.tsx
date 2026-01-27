"use client";

import { clsx } from "@/shared/lib/clsx";

import styles from "./Button.module.scss";

import type { ButtonProps } from "./types";

export const Button = (props: ButtonProps) => {
  const { children, onClick, className, disabled } = props;
  const buttonClassName = clsx(styles.button, className);

  return (
    <button type="button" onClick={onClick} className={buttonClassName} disabled={disabled}>
      {children}
    </button>
  );
};
