"use client";

import { observer } from "mobx-react-lite";
import { useState } from "react";

import ListOfUsers from "@/shared/components/ListOfUsers/ListOfUsers";
import { ListOfUsersStore } from "@/shared/components/ListOfUsers/ListOfUsers.store";
import PopupCard from "@/shared/components/PopupCard/popupCard";
import { PopupCardStore } from "@/shared/components/PopupCard/PopupCard.store";
import overlayStyles from "@/shared/components/PopupCard/popupOverlay.module.scss";
import TitleBar from "@/shared/components/TitleBar/TitleBar";

const UsersListPage = observer(() => {
  const [popupStore] = useState(() => new PopupCardStore());
  const [usersStore] = useState(() => new ListOfUsersStore());

  const getRoleLabel = (role: string) => (role === "admin" ? "Администратор" : "Пользователь");

  return (
    <>
      <TitleBar onCreateClick={popupStore.open} />
      <ListOfUsers store={usersStore} />

      {popupStore.isOpen && (
        <div className={overlayStyles.overlay} onClick={popupStore.close}>
          <div onClick={(e) => e.stopPropagation()}>
            <PopupCard
              title="Пригласить пользователя"
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
                  label: "Email администратора*",
                  type: "email",
                  placeholder: "admin@admin.ru",
                  value: popupStore.email,
                  onChange: popupStore.setEmail,
                },
              ]}
              onSubmit={() => {
                usersStore.addUser({
                  fullName: popupStore.fio,
                  email: popupStore.email,
                  role: getRoleLabel(popupStore.role),
                });
                popupStore.resetForm();
                popupStore.close();
              }}
              onCancel={() => {
                popupStore.resetForm();
                popupStore.close();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
});

export default UsersListPage;
