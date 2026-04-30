export interface ModalProps {
  children?: React.ReactNode;
  className?: string | undefined;
  hideCloseButton?: boolean;
  isOpen: boolean;
  onClose: () => void;
}
