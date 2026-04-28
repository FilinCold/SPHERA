import styles from "./ExitPopup.module.scss";

type ExitPopupProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export const ExitPopup = ({ onCancel, onConfirm }: ExitPopupProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>Выход</div>
        <div className={styles.body}>Вы уверены, что хотите выйти из акаунта?</div>
        <div className={styles.footer}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Отмена
          </button>
          <button type="button" className={styles.deleteButton} onClick={onConfirm}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitPopup;
