"use client";

import styles from "./SimpleCardButton.module.scss";

import type { SimpleCardButtonProps } from "./types";

export const SimpleCardButton = ({ onCancel, onSave }: SimpleCardButtonProps) => {
  return (
    <div className={styles.footer}>
      <button type="button" onClick={onCancel}>
        Отмена
      </button>
      <button type="submit" onClick={onSave}>
        Создать
      </button>
    </div>
  );
};
