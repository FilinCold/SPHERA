import type { InputHTMLAttributes, ReactNode } from "react";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string | ReactNode;
  error?: string;
};
