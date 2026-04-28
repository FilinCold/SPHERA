import { observer } from "mobx-react-lite";
import { useState } from "react";

import overlayStyles from "@/shared/components/PopupCards/PopupOverlay.module.scss";

import styles from "./ListOfUsers.module.scss";
import { ListOfUsersStore } from "./ListOfUsers.store";
import ListOfUsersDeletePopup from "./ListOfUsersDeletePopup";

import type { User } from "./types";

type ListOfUsersProps = {
  store?: ListOfUsersStore;
  onEdit?: (user: User) => void;
};

export const ListOfUsers = observer(({ store: externalStore, onEdit }: ListOfUsersProps) => {
  const [localStore] = useState(() => new ListOfUsersStore());
  const [userIdForDelete, setUserIdForDelete] = useState<number | null>(null);
  const store = externalStore ?? localStore;

  const handleDelete = (id: number) => {
    setUserIdForDelete(id);
  };

  const handleCancelDelete = () => {
    setUserIdForDelete(null);
  };

  const handleConfirmDelete = () => {
    if (userIdForDelete === null) {
      return;
    }
    store.deleteUser(userIdForDelete);
    setUserIdForDelete(null);
  };

  const handleShare = () => {
    alert("Ссылка успешно скопирована");
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div>ФИО сотрудника</div>
          <div>Email</div>
          <div>Роль</div>
          <div>Статус</div>
          <div></div>
        </div>

        {store.users.map((user) => (
          <div key={user.id} className={styles.row}>
            <div>{user.fullName}</div>
            <div>{user.email}</div>
            <div>{user.role}</div>
            <div>
              <span
                className={`${styles.status} ${
                  user.status === "active" ? styles.active : styles.blocked
                }`}
              >
                {user.status === "active" ? "Активен" : "Заблокирован"}
              </span>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} onClick={() => onEdit?.(user)}>
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3.12132H3C2.46957 3.12132 1.96086 3.33203 1.58579 3.70711C1.21071 4.08218 1 4.59089 1 5.12132V19.1213C1 19.6518 1.21071 20.1605 1.58579 20.5355C1.96086 20.9106 2.46957 21.1213 3 21.1213H17C17.5304 21.1213 18.0391 20.9106 18.4142 20.5355C18.7893 20.1605 19 19.6518 19 19.1213V12.1213M17.5 1.62132C17.8978 1.2235 18.4374 1 19 1C19.5626 1 20.1022 1.2235 20.5 1.62132C20.8978 2.01915 21.1213 2.55871 21.1213 3.12132C21.1213 3.68393 20.8978 4.2235 20.5 4.62132L11 14.1213L7 15.1213L8 11.1213L17.5 1.62132Z"
                    stroke="#181D27"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className={styles.button} onClick={handleShare}>
                <svg
                  width="20"
                  height="22"
                  viewBox="0 0 20 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.59 12.51L13.42 16.49M13.41 5.51L6.59 9.49M19 4C19 5.65685 17.6569 7 16 7C14.3431 7 13 5.65685 13 4C13 2.34315 14.3431 1 16 1C17.6569 1 19 2.34315 19 4ZM7 11C7 12.6569 5.65685 14 4 14C2.34315 14 1 12.6569 1 11C1 9.34315 2.34315 8 4 8C5.65685 8 7 9.34315 7 11ZM19 18C19 19.6569 17.6569 21 16 21C14.3431 21 13 19.6569 13 18C13 16.3431 14.3431 15 16 15C17.6569 15 19 16.3431 19 18Z"
                    stroke="#181D27"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className={styles.button} onClick={() => handleDelete(user.id)}>
                <svg
                  width="20"
                  height="22"
                  viewBox="0 0 20 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5H3M3 5H19M3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V5H3ZM6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5M8 10V16M12 10V16"
                    stroke="#181D27"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {userIdForDelete !== null && (
        <div className={overlayStyles.overlay} onClick={handleCancelDelete}>
          <div onClick={(event) => event.stopPropagation()}>
            <ListOfUsersDeletePopup onCancel={handleCancelDelete} onDelete={handleConfirmDelete} />
          </div>
        </div>
      )}
    </>
  );
});

export default ListOfUsers;
