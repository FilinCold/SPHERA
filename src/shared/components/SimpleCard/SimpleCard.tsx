"use client";

import clsx from "clsx";
import { startTransition, useMemo, useRef, useState } from "react";

import { SimpleCardButton } from "../SimpleCardButton/SimpleCardButton";

import { DateRangeField } from "./DateRangeField";
import styles from "./SimpleCard.module.scss";

import type { SimpleCardProps, FormData, InputField } from "./types";

const EMPTY_FIELD_MESSAGE = "Заполните поле";
const INVALID_EMAIL_MESSAGE = "Введите корректный email";

const EMAIL_FORMAT_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Блокировка «Создать» по фактическому состоянию формы (не только по родительскому onChange). */
function areRequiredFieldsSatisfied(fields: InputField[], data: FormData): boolean {
  for (const field of fields) {
    if (!field.required) {
      continue;
    }

    if (field.type === "readonly") {
      const raw = data[field.name];

      if (typeof raw !== "string" || !raw.trim()) {
        return false;
      }

      continue;
    }

    if (field.type === "dateRange") {
      const start = data[`${field.name}Start`];
      const end = data[`${field.name}End`];

      if (typeof start !== "string" || !start.trim() || typeof end !== "string" || !end.trim()) {
        return false;
      }

      continue;
    }

    const raw = data[field.name];

    if (typeof raw !== "string" || !raw.trim()) {
      return false;
    }

    const patternRe = field.pattern ? new RegExp(field.pattern) : null;

    if (field.type === "email" && !EMAIL_FORMAT_RE.test(raw.trim())) {
      return false;
    }

    if (patternRe && !patternRe.test(raw.trim())) {
      return false;
    }
  }

  return true;
}

export const SimpleCard = ({
  title,
  headerAlign = "left",
  fields,
  initialValues,
  onCancel,
  onSubmit,
  onChange,
  submitDisabled = false,
  embedded = false,
  hideFooter = false,
  submitLabel = "Создать",
  className,
}: SimpleCardProps) => {
  const [formData, setFormData] = useState<FormData>(() => ({ ...initialValues }));
  const formDataRef = useRef<FormData>({ ...initialValues });

  const parentChangeNotifyScheduled = useRef(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const requiredFilled = useMemo(
    () => areRequiredFieldsSatisfied(fields, formData),
    [fields, formData],
  );
  const effectiveSubmitDisabled = submitDisabled || !requiredFilled;

  const clearFieldError = (name: string) => {
    setFieldErrors((prev) => {
      if (!(name in prev)) {
        return prev;
      }

      const next = { ...prev };

      delete next[name];

      return next;
    });
  };

  const handleChange = (name: string, value: FormData[string]) => {
    if (typeof value === "string" && value.trim()) {
      clearFieldError(name);
    }

    const newData = { ...formDataRef.current, [name]: value };

    formDataRef.current = newData;
    setFormData(newData);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (effectiveSubmitDisabled) {
      return;
    }

    onSubmit?.(formData);
  };

  const renderField = (field: InputField) => {
    const value = formData[field.name] ?? "";

    if (field.type === "readonly") {
      const text = typeof value === "string" ? value : "";

      return (
        <>
          <input name={field.name} type="hidden" value={text} readOnly />
          <div className={styles.readonlyField}>
            <span className={styles.readonlyValue}>{text}</span>
            {field.showStatusDot ? <span aria-hidden="true" className={styles.statusDot} /> : null}
          </div>
        </>
      );
    }

    if (field.type === "dateRange") {
      const startName = `${field.name}Start`;
      const endName = `${field.name}End`;
      const startValue = formData[startName];
      const endValue = formData[endName];
      const placeholder = field.placeholder || "__.__.____";

      return (
        <DateRangeField
          endName={endName}
          endValue={typeof endValue === "string" ? endValue : ""}
          placeholder={placeholder}
          required={Boolean(field.required)}
          startName={startName}
          startValue={typeof startValue === "string" ? startValue : ""}
          variant={field.dateRangeVariant ?? "popover"}
          onFieldChange={handleChange}
        />
      );
    }

    if (field.name === "subscriptionDate" || field.type === "date") {
      const err = fieldErrors[field.name];

      return (
        <>
          <input
            name={field.name}
            required={Boolean(field.required)}
            aria-invalid={Boolean(err)}
            className={err ? styles.inputInvalid : undefined}
            type="text"
            placeholder="__.__.____"
            value={typeof value === "string" ? value : ""}
            onBlur={(e) => {
              if (field.required && !e.target.value.trim()) {
                setFieldErrors((prev) => ({ ...prev, [field.name]: EMPTY_FIELD_MESSAGE }));
              }
            }}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onFocus={() => {
              clearFieldError(field.name);
            }}
          />
          {err ? (
            <p className={styles.fieldError} role="alert">
              {err}
            </p>
          ) : null}
        </>
      );
    }

    // select
    if (field.type === "select") {
      const err = fieldErrors[field.name];
      const strVal = typeof value === "string" ? value : "";
      const ind = field.selectStatusIndicators;
      let statusDot: "green" | "red" | null = null;

      if (ind) {
        if (strVal === ind.greenWhenValue) {
          statusDot = "green";
        } else if (strVal === ind.redWhenValue) {
          statusDot = "red";
        }
      }

      const selectEl = (
        <select
          name={field.name}
          required={Boolean(field.required)}
          aria-invalid={Boolean(err)}
          className={err ? styles.inputInvalid : undefined}
          value={strVal}
          onBlur={(e) => {
            if (field.required && !e.target.value.trim()) {
              setFieldErrors((prev) => ({ ...prev, [field.name]: EMPTY_FIELD_MESSAGE }));
            }
          }}
          onChange={(e) => handleChange(field.name, e.target.value)}
          onFocus={() => {
            clearFieldError(field.name);
          }}
        >
          {!field.skipEmptySelectOption ? <option value="">Выберите...</option> : null}
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

      return (
        <>
          {ind ? (
            <div className={styles.selectWithIndicator}>
              {statusDot === "green" ? (
                <span aria-hidden="true" className={styles.statusDot} />
              ) : null}
              {statusDot === "red" ? (
                <span aria-hidden="true" className={styles.statusDotRed} />
              ) : null}
              {selectEl}
            </div>
          ) : (
            selectEl
          )}
          {err ? (
            <p className={styles.fieldError} role="alert">
              {err}
            </p>
          ) : null}
        </>
      );
    }

    const err = fieldErrors[field.name];

    return (
      <>
        <input
          name={field.name}
          required={Boolean(field.required)}
          pattern={field.pattern}
          aria-invalid={Boolean(err)}
          className={err ? styles.inputInvalid : undefined}
          type={field.type || "text"}
          placeholder={field.placeholder || "Введите значение"}
          value={typeof value === "string" ? value : ""}
          onBlur={(e) => {
            const trimmedValue = e.target.value.trim();

            if (field.required && !trimmedValue) {
              setFieldErrors((prev) => ({ ...prev, [field.name]: EMPTY_FIELD_MESSAGE }));

              return;
            }

            if (field.type === "email" && trimmedValue && !EMAIL_FORMAT_RE.test(trimmedValue)) {
              setFieldErrors((prev) => ({ ...prev, [field.name]: INVALID_EMAIL_MESSAGE }));
            }
          }}
          onChange={(e) => handleChange(field.name, e.target.value)}
          onFocus={() => {
            clearFieldError(field.name);
          }}
        />
        {err ? (
          <p className={styles.fieldError} role="alert">
            {err}
          </p>
        ) : null}
      </>
    );
  };

  const rootClass = clsx(styles.card, embedded && styles.cardEmbedded, className);
  const body = (
    <>
      <div
        className={clsx(styles.header, headerAlign === "center" && styles.headerCentered)}
        data-slot="header"
      >
        {title}
      </div>

      <div className={styles.body} data-slot="body">
        {fields.map((field) => (
          <div key={field.name} className={styles.field} data-slot="field">
            <label>{field.label}</label>
            {renderField(field)}
          </div>
        ))}
      </div>

      {!hideFooter ? (
        <SimpleCardButton
          submitDisabled={effectiveSubmitDisabled}
          submitLabel={submitLabel}
          onCancel={onCancel || (() => window.history.back())}
        />
      ) : null}
    </>
  );

  if (embedded) {
    return <div className={rootClass}>{body}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={rootClass}>
      {body}
    </form>
  );
};
