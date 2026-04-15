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
  onCancel?: () => void;
  onSubmit?: (data: Record<string, string>) => void;
}
