import clsx from "clsx";

import styles from "./Input.module.scss";

import type { InputProps } from "./types";

export function Input(props: InputProps) {
  const { label, error, inputUpgrade, className } = props;
  const fieldClassName = clsx(styles.field, error && styles.error);

  const inputClassName = clsx(styles.input, className);

  return (
    <label className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={fieldClassName}>
        <input className={inputClassName} />
        {inputUpgrade && <div className={styles.inputUpgrade}>{inputUpgrade}</div>}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </label>
  );
}
