"use client";

import { useState } from "react";

import { SimpleCardButton } from "../SimpleCardButton/SimpleCardButton";

import styles from "./SimpleCard.module.scss";

import type { SimpleCardProps, FormData, InputField } from "./types";

export const SimpleCard = ({ title, fields, onCancel, onSubmit, onChange }: SimpleCardProps) => {
  const [formData, setFormData] = useState<FormData>({});

  const handleChange = (name: string, value: FormData[string]) => {
    const newData = { ...formData, [name]: value };

    setFormData(newData);
    onChange?.(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const renderField = (field: InputField) => {
    const value = formData[field.name] ?? "";

    // Заглушка для даты
    if (field.name === "subscriptionDate" || field.type === "date") {
      return (
        <input
          type="text"
          placeholder="__.__.____"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          value={typeof value === "string" ? value : ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
        >
          <option value="">Выберите...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type || "text"}
        placeholder={field.placeholder || "Введите значение"}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => handleChange(field.name, e.target.value)}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.card}>
      <div className={styles.header}>{title}</div>

      <div className={styles.body}>
        {fields.map((field) => (
          <div key={field.name} className={styles.field}>
            <label>{field.label}</label>
            {renderField(field)}
          </div>
        ))}
      </div>

      <SimpleCardButton onCancel={onCancel || (() => window.history.back())} />
    </form>
  );
};
