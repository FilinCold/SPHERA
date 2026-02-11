import clsx from "clsx";

import styles from "./Checkbox.module.scss";

import type { CheckboxProps } from "./types";

export const Checkbox = (props: CheckboxProps) => {
  const { label, error, className, ...rest } = props;
  const wrapperClassName = clsx(styles.wrapper, className);
  const checkboxClassName = clsx(styles.checkbox, error && styles.error);

  return (
    <label className={wrapperClassName}>
      <div className={styles.control}>
        <input type="checkbox" className={checkboxClassName} {...rest} />
        <span className={styles.check} />
      </div>
      <span className={styles.label}>{label}</span>
      {error && <span className={styles.errorText}>{error}</span>}
    </label>
  );
};
