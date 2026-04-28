import styles from "./ListOfUsersDeletePopup.module.scss";

type ListOfUsersDeletePopupProps = {
  onCancel: () => void;
  onDelete: () => void;
};
export const ListOfUsersDeletePopup = ({ onCancel, onDelete }: ListOfUsersDeletePopupProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>Удаление пользователя</div>
      <div className={styles.body}>Вы уверены, что хотите удалить пользователя?</div>
      <div className={styles.footer}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Отмена
        </button>
        <button type="button" className={styles.deleteButton} onClick={onDelete}>
          Удалить
        </button>
      </div>
    </div>
  );
};
export default ListOfUsersDeletePopup;
