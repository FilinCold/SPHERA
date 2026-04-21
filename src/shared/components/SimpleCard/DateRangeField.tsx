"use client";

import clsx from "clsx";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ru } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { createPortal } from "react-dom";

import {
  formatDateRu,
  formatDigitsToDdMmYyyy,
  getSubscriptionMaxCalendarDate,
  getSubscriptionMinCalendarDate,
  isCalendarDateNotAfterMax,
  isCalendarYearNotBefore,
  normalizeRussianDateString,
  parseDateRu,
  sanitizeDateDigits,
} from "./dateInputMask";
import styles from "./DateRangeField.module.scss";

function CalendarGlyph() {
  return (
    <svg aria-hidden="true" focusable="false" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="M7 3v2M17 3v2M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

const DEFAULT_PLACEHOLDER = "__.__.____";

type DateRangeFieldProps = {
  startName: string;
  endName: string;
  startValue: string;
  endValue: string;
  placeholder?: string;
  /** Показать «Заполните поле», если после blur дата не введена. */
  required?: boolean;
  /** `inline` — календарь всегда под полями (макет edit-space). */
  variant?: "popover" | "inline";
  onFieldChange: (name: string, value: string) => void;
};

export function DateRangeField({
  startName,
  endName,
  startValue,
  endValue,
  placeholder = DEFAULT_PLACEHOLDER,
  required = false,
  variant = "popover",
  onFieldChange,
}: DateRangeFieldProps) {
  const isInline = variant === "inline";
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ left: 0, top: 0 });
  const [errors, setErrors] = useState<{ start?: string; end?: string }>({});
  /** Какое поле сейчас редактируется через календарь (по фокусу или по кнопке календаря). */
  const [calendarTarget, setCalendarTarget] = useState<"start" | "end">("start");

  const fromDate = parseDateRu(startValue);
  const toDate = parseDateRu(endValue);

  const selectedSingle = calendarTarget === "start" ? fromDate : toDate;

  const subscriptionMin = getSubscriptionMinCalendarDate();
  const subscriptionMax = getSubscriptionMaxCalendarDate();
  const currentYear = new Date().getFullYear();

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const updatePopoverPosition = useCallback(() => {
    const anchor = rootRef.current;

    if (!anchor) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const gap = 8;
    const margin = 12;
    let left = rect.left;
    const estimatedWidth = 340;
    const maxLeft = window.innerWidth - estimatedWidth - margin;

    if (left > maxLeft) {
      left = Math.max(margin, maxLeft);
    }

    let top = rect.bottom + gap;
    const estimatedHeight = 380;
    const maxTop = window.innerHeight - estimatedHeight - margin;

    if (top > maxTop && rect.top > estimatedHeight + gap) {
      top = Math.max(margin, rect.top - estimatedHeight - gap);
    } else if (top > maxTop) {
      top = Math.max(margin, maxTop);
    }

    setPopoverPos({ left, top });
  }, []);

  useLayoutEffect(() => {
    if (isInline || !open) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      updatePopoverPosition();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isInline, open, updatePopoverPosition]);

  useEffect(() => {
    if (isInline || !open) {
      return;
    }

    const onScrollOrResize = () => {
      updatePopoverPosition();
    };

    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);

    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [isInline, open, updatePopoverPosition]);

  useEffect(() => {
    if (isInline || !open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (rootRef.current?.contains(target)) {
        return;
      }

      if (popoverRef.current?.contains(target)) {
        return;
      }

      close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, isInline, open]);

  const handleCalendarSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        if (calendarTarget === "start") {
          onFieldChange(startName, "");
        } else {
          onFieldChange(endName, "");
        }

        if (!isInline) {
          close();
        }

        return;
      }

      const formatted = formatDateRu(date);
      const startD = parseDateRu(startValue);
      const endD = parseDateRu(endValue);

      if (calendarTarget === "start") {
        if (endD && date > endD) {
          onFieldChange(startName, formatted);
          onFieldChange(endName, formatted);
        } else {
          onFieldChange(startName, formatted);
        }
      } else if (!startD) {
        onFieldChange(startName, formatted);
        onFieldChange(endName, formatted);
      } else if (date < startD) {
        onFieldChange(startName, formatted);
        onFieldChange(endName, formatted);
      } else {
        onFieldChange(endName, formatted);
      }

      if (!isInline) {
        close();
      }
    },
    [calendarTarget, close, endName, endValue, isInline, onFieldChange, startName, startValue],
  );

  const openPopoverFor = useCallback(
    (target: "start" | "end") => {
      if (isInline) {
        return;
      }

      setCalendarTarget(target);
      setOpen(true);
    },
    [isInline],
  );

  const clearError = (key: "start" | "end") => {
    setErrors((prev) => {
      const next = { ...prev, [key]: undefined };

      return next;
    });
  };

  const handleMaskedChange = (raw: string, name: string, key: "start" | "end") => {
    clearError(key);
    const digits = sanitizeDateDigits(raw);

    onFieldChange(name, formatDigitsToDdMmYyyy(digits));
  };

  const handleBlur = (raw: string, name: string, key: "start" | "end") => {
    const trimmed = raw.trim();

    if (!trimmed) {
      if (required) {
        setErrors((prev) => ({
          ...prev,
          [key]: "Заполните поле",
        }));
      } else {
        clearError(key);
      }

      return;
    }

    const normalized = normalizeRussianDateString(raw);

    if (!normalized) {
      onFieldChange(name, "");
      setErrors((prev) => ({
        ...prev,
        [key]: "Укажите дату в формате ДД.ММ.ГГГГ (корректный день и месяц).",
      }));

      return;
    }

    const parsed = parseDateRu(normalized);

    if (!parsed) {
      onFieldChange(name, "");
      setErrors((prev) => ({
        ...prev,
        [key]: "Укажите дату в формате ДД.ММ.ГГГГ (корректный день и месяц).",
      }));

      return;
    }

    if (!isCalendarYearNotBefore(parsed, currentYear)) {
      onFieldChange(name, "");
      setErrors((prev) => ({
        ...prev,
        [key]: "Год не может быть меньше текущего.",
      }));

      return;
    }

    if (!isCalendarDateNotAfterMax(parsed, subscriptionMax)) {
      onFieldChange(name, "");
      setErrors((prev) => ({
        ...prev,
        [key]: "Дата не может быть позже, чем через 5 лет от сегодняшнего дня.",
      }));

      return;
    }

    onFieldChange(name, normalized);
    clearError(key);
  };

  const defaultMonth =
    calendarTarget === "start"
      ? (fromDate ?? toDate ?? new Date())
      : (toDate ?? fromDate ?? new Date());

  const picker = (
    <DayPicker
      key={calendarTarget}
      captionLayout="dropdown"
      className={clsx(styles.dayPicker, isInline && styles.dayPickerInline)}
      defaultMonth={defaultMonth}
      disabled={[{ before: subscriptionMin }, { after: subscriptionMax }]}
      fromYear={currentYear}
      locale={ru}
      mode="single"
      required={false}
      selected={selectedSingle}
      toYear={currentYear + 5}
      onSelect={handleCalendarSelect}
    />
  );

  return (
    <div ref={rootRef} className={styles.dateRangeRoot}>
      <div className={styles.dateRange} role="group">
        <div className={styles.dateColumn}>
          <div className={styles.dateInputWrap}>
            <input
              name={startName}
              required={required}
              aria-haspopup={isInline ? undefined : "dialog"}
              aria-invalid={Boolean(errors.start)}
              autoComplete="off"
              className={`${styles.dateInput} ${errors.start ? styles.dateInputInvalid : ""}`}
              inputMode="numeric"
              placeholder={placeholder}
              type="text"
              value={startValue}
              onBlur={() => {
                handleBlur(startValue, startName, "start");
              }}
              onChange={(event) => {
                handleMaskedChange(event.target.value, startName, "start");
              }}
              onFocus={() => {
                clearError("start");
                setCalendarTarget("start");
              }}
            />
            {!isInline ? (
              <button
                aria-label="Открыть календарь: дата начала"
                className={styles.calendarBtn}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  openPopoverFor("start");
                }}
              >
                <CalendarGlyph />
              </button>
            ) : null}
          </div>
          {errors.start ? (
            <p className={styles.errorText} role="alert">
              {errors.start}
            </p>
          ) : null}
        </div>

        <span className={styles.dateDash}>-</span>

        <div className={styles.dateColumn}>
          <div className={styles.dateInputWrap}>
            <input
              name={endName}
              required={required}
              aria-haspopup={isInline ? undefined : "dialog"}
              aria-invalid={Boolean(errors.end)}
              autoComplete="off"
              className={`${styles.dateInput} ${errors.end ? styles.dateInputInvalid : ""}`}
              inputMode="numeric"
              placeholder={placeholder}
              type="text"
              value={endValue}
              onBlur={() => {
                handleBlur(endValue, endName, "end");
              }}
              onChange={(event) => {
                handleMaskedChange(event.target.value, endName, "end");
              }}
              onFocus={() => {
                clearError("end");
                setCalendarTarget("end");
              }}
            />
            {!isInline ? (
              <button
                aria-label="Открыть календарь: дата окончания"
                className={styles.calendarBtn}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  openPopoverFor("end");
                }}
              >
                <CalendarGlyph />
              </button>
            ) : null}
          </div>
          {errors.end ? (
            <p className={styles.errorText} role="alert">
              {errors.end}
            </p>
          ) : null}
        </div>
      </div>

      {isInline ? (
        <div
          aria-label={
            calendarTarget === "start"
              ? "Календарь: выбор даты начала периода"
              : "Календарь: выбор даты окончания периода"
          }
          className={styles.inlinePanel}
          role="group"
        >
          {picker}
        </div>
      ) : null}

      {!isInline && open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={popoverRef}
              className={styles.popover}
              role="dialog"
              aria-label="Календарь"
              style={{ left: popoverPos.left, top: popoverPos.top }}
            >
              {picker}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
