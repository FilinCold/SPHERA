"use client";

import { useState } from "react";

import styles from "./AdminCard.module.scss";

import type { AdminCardProps } from "./types";

export const AdminCard = ({ title, fields, onCancel, onSubmit }: AdminCardProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      console.log("Отмена (заглушка)");
      /*
      // Пример реального запроса при отмене (например, снять lock формы)
      await fetch("/api/admin/draft/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      */
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log("Создать (заглушка)", formData);
      /*
      // Пример реального запроса на создание/обновление администратора
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      */
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>{title}</div>

      <div className={styles.body}>
        {fields.map((field) => (
          <div key={field.name} className={styles.field}>
            <label>
              {field.label}
              {field.required && "*"}
            </label>

            <input
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.cancel} onClick={handleCancel}>
          Отмена
        </button>
        <button className={styles.submit} onClick={handleSubmit}>
          Создать
        </button>
      </div>
    </div>
  );
};
