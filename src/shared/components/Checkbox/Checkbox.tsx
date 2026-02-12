import clsx from "clsx";

import styles from "./Checkbox.module.scss";

import type { CheckboxProps } from "./types";

export const Checkbox = (props: CheckboxProps) => {
  const { label, error, className, ...rest } = props;
  const wrapperClassName = clsx(styles.wrapper, className);
  const checkboxClassName = clsx(styles.checkbox, error && styles.error);

  return (
    <div className={wrapperClassName}>
      <div className={styles.control}>
        <input type="checkbox" className={checkboxClassName} {...rest} />
        <span className={styles.check} />
      </div>
      <label className={styles.label}>{label}</label>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
