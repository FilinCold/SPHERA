"use client";

import clsx from "clsx";
import { useState } from "react";

import styles from "./AdminCard.module.scss";

import type { AdminCardProps } from "./types";

export const AdminCard = ({
  title,
  fields,
  initialValues,
  onCancel,
  onSubmit,
  hideFooter = false,
  submitLabel = "Создать",
  className,
}: AdminCardProps) => {
  const [formData, setFormData] = useState<Record<string, string>>(() => ({ ...initialValues }));

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    // Без onCancel — no-op (заглушка до интеграции с API)
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
    // Без onSubmit — no-op (заглушка до интеграции с API)
  };

  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.header}>{title}</div>

      <div className={styles.body}>
        {fields.map((field) => (
          <div key={field.name} className={styles.field}>
            <label>
              {field.label}
              {field.required && "*"}
            </label>

            <input
              name={field.name}
              required={Boolean(field.required)}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </div>
        ))}
      </div>

      {!hideFooter ? (
        <div className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={handleCancel}>
            Отмена
          </button>
          <button type="button" className={styles.submit} onClick={handleSubmit}>
            {submitLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
};
