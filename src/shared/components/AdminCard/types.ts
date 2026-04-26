export interface AdminField {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export interface AdminCardProps {
  title: string;
  fields: AdminField[];
  initialValues?: Record<string, string>;
  onChange?: (data: Record<string, string>) => void;
  onCancel?: () => void;
  onSubmit?: (data: Record<string, string>) => void;
  /** Без нижней панели кнопок — для общей панели на странице. */
  hideFooter?: boolean;
  /** Текст основной кнопки. */
  submitLabel?: string;
  /** Одноколоночная сетка полей (например, для ФИО + Email). */
  singleColumn?: boolean;
  className?: string;
}
