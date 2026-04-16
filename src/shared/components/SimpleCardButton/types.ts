export interface SimpleCardButtonProps {
  onCancel?: () => void;
  onSave?: (e: React.FormEvent) => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}
