import type { DateRange } from "react-day-picker";

export type FieldType = "text" | "email" | "date" | "select" | "dateRange" | "readonly";

export type FormData = Record<string, string | DateRange | undefined>;

export type InputField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: FieldType;
  /** Показать ошибку «Заполните поле», если после blur значение пустое. */
  required?: boolean;
  options?: { label: string; value: string }[]; // для select
  /** Не показывать пустой `<option value="">` (например статус только «активно / приостановлено»). */
  skipEmptySelectOption?: boolean;
  /** Для `select`: зелёный / красный кружок слева от поля по текущему значению. */
  selectStatusIndicators?: {
    greenWhenValue: string;
    redWhenValue: string;
  };
  /** Для `readonly` — зелёный индикатор (например «Активно»). */
  showStatusDot?: boolean;
  /** Для `dateRange`: встроенный календарь под полями (макет edit-space). */
  dateRangeVariant?: "popover" | "inline";
};

export interface SimpleCardProps {
  title: string;
  fields: InputField[];
  /** Начальные значения полей (например после перехода с made-space). */
  initialValues?: Partial<FormData>;
  onCancel?: () => void;
  onSubmit?: (data: FormData) => void;
  onChange?: (data: FormData) => void;
  /** Дополнительно блокирует кнопку (например, загрузка). Поля с `required` отключают кнопку сами по состоянию формы. */
  submitDisabled?: boolean;
  /** Без обёртки `<form>` — для вложения в форму родителя (например edit-space). */
  embedded?: boolean;
  /** Скрыть нижнюю панель кнопок. */
  hideFooter?: boolean;
  /** Текст на основной кнопке отправки. */
  submitLabel?: string;
  className?: string;
}
