"use client";

import styles from "./SimpleCardButton.module.scss";

import type { SimpleCardButtonProps } from "./types";

export const SimpleCardButton = ({
  onCancel,
  onSave,
  submitDisabled = false,
  submitLabel = "Создать",
}: SimpleCardButtonProps) => {
  return (
    <div className={styles.footer}>
      <button type="button" onClick={onCancel} className={styles.cancelButton}>
        Отмена
      </button>
      <button
        type="submit"
        disabled={submitDisabled}
        aria-disabled={submitDisabled}
        onClick={onSave}
        className={styles.saveButton}
      >
        {submitLabel}
      </button>
    </div>
  );
};
