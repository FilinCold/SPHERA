export type SelectOption = {
  label: string;
  value: string;
};

export type InputType = {
  label: string;
  type?: "text" | "number" | "email" | "password" | "select";
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  options?: SelectOption[];
  disabled?: boolean;
};

export interface PopupCardProps {
  title: string;
  inputs: InputType[];
  onSubmit: () => void;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
  submitDisabled?: boolean;
}
