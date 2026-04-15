import type { DateRange } from "react-day-picker";

export type FieldType = "text" | "email" | "date" | "select" | "dateRange";

export type FormData = Record<string, string | DateRange | undefined>;

export type InputField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: FieldType;
  options?: { label: string; value: string }[]; // для select
};

export interface SimpleCardProps {
  title: string;
  fields: InputField[];
  onCancel?: () => void;
  onSubmit?: (data: FormData) => void;
  onChange?: (data: FormData) => void;
}
