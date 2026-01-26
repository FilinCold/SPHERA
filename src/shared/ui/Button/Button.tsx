"use client";

import { clsx } from "@/shared/lib/clsx";
import type { ButtonProps } from "./types";
import styles from "./Button.module.scss";

export const Button = ({ children, onClick, className, disabled }: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(styles.button, className)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
