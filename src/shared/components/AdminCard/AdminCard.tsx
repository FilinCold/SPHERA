"use client";

import clsx from "clsx";
import { startTransition, useRef, useState } from "react";

import styles from "./AdminCard.module.scss";

import type { AdminCardProps } from "./types";

export const AdminCard = ({
  title,
  fields,
  initialValues,
  onChange,
  onCancel,
  onSubmit,
  hideFooter = false,
  submitLabel = "Создать",
  singleColumn = false,
  className,
}: AdminCardProps) => {
  const [formData, setFormData] = useState<Record<string, string>>(() => ({ ...initialValues }));
  const formDataRef = useRef<Record<string, string>>({ ...initialValues });

  const parentChangeNotifyScheduled = useRef(false);

  const handleChange = (name: string, value: string) => {
    const next = { ...formDataRef.current, [name]: value };

    formDataRef.current = next;
    setFormData(next);

    if (!onChange) {
      return;
    }

    if (parentChangeNotifyScheduled.current) {
      return;
    }

    parentChangeNotifyScheduled.current = true;
    queueMicrotask(() => {
      parentChangeNotifyScheduled.current = false;
      startTransition(() => {
        onChange(formDataRef.current);
      });
    });
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
      <div className={styles.header} data-slot="header">
        {title}
      </div>

      <div className={clsx(styles.body, singleColumn && styles.bodySingleColumn)} data-slot="body">
        {fields.map((field) => (
          <div key={field.name} className={styles.field} data-slot="field">
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
