"use client";

import { observer } from "mobx-react-lite";
import { useState } from "react";

import ListOfUsers from "@/shared/components/ListOfUsers/ListOfUsers";
import { ListOfUsersStore } from "@/shared/components/ListOfUsers/ListOfUsers.store";
import type { User } from "@/shared/components/ListOfUsers/types";
import PopupCard from "@/shared/components/PopupCards/PopupCard";
import { PopupCardStore } from "@/shared/components/PopupCards/PopupCard.store";
import overlayStyles from "@/shared/components/PopupCards/PopupOverlay.module.scss";
import TitleBar from "@/shared/components/TitleBar/TitleBar";

const UsersListPage = observer(() => {
  const [popupStore] = useState(() => new PopupCardStore());
  const [usersStore] = useState(() => new ListOfUsersStore());
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const getRoleLabel = (role: string) => (role === "admin" ? "Администратор" : "Пользователь");

  const handleEdit = (user: User) => {
    setEditingUser(user);
    popupStore.setFio(user.fullName);
    popupStore.setEmail(user.email);
    popupStore.setRole(user.role === "Администратор" ? "admin" : "user");
    popupStore.open();
  };

  const handleSubmit = () => {
    if (editingUser) {
      editingUser.fullName = popupStore.fio;
      editingUser.email = popupStore.email;
      editingUser.role = getRoleLabel(popupStore.role);
      usersStore.updateUser();
    } else {
      usersStore.addUser({
        fullName: popupStore.fio,
        email: popupStore.email,
        role: getRoleLabel(popupStore.role),
      });
    }
    popupStore.resetForm();
    popupStore.close();
    setEditingUser(null);
  };

  const handleCancel = () => {
    popupStore.resetForm();
    popupStore.close();
    setEditingUser(null);
  };

  return (
    <>
      <TitleBar
        onCreateClick={() => {
          setEditingUser(null);
          popupStore.resetForm();
          popupStore.open();
        }}
      />
      <ListOfUsers store={usersStore} onEdit={handleEdit} />

      {popupStore.isOpen && (
        <div className={overlayStyles.overlay} onClick={handleCancel}>
          <div onClick={(e) => e.stopPropagation()}>
            <PopupCard
              title={editingUser ? "Редактировать пользователя" : "Добавить пользователя"}
              inputs={[
                {
                  label: "Роль*",
                  type: "select",
                  value: popupStore.role,
                  onChange: popupStore.setRole,
                  options: [
                    { label: "Администратор", value: "admin" },
                    { label: "Пользователь", value: "user" },
                  ],
                },
                {
                  label: "ФИО*",
                  type: "text",
                  placeholder: "Сидоров Иван Петрович",
                  value: popupStore.fio,
                  onChange: popupStore.setFio,
                },
                {
                  label: "Email*",
                  type: "email",
                  placeholder: "user@example.ru",
                  value: popupStore.email,
                  onChange: popupStore.setEmail,
                },
              ]}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </>
  );
});

export default UsersListPage;
