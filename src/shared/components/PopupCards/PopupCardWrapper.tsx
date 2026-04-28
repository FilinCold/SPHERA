"use client";

import { useState } from "react";

import PopupCard from "./PopupCard";

const PopupCardWrapper = () => {
  const [role, setRole] = useState("admin");
  const [fio, setFio] = useState("");
  const [email, setEmail] = useState("");

  return (
    <PopupCard
      title="Пригласить пользователя"
      inputs={[
        {
          label: "Роль*",
          type: "select",
          value: role,
          onChange: setRole,
          options: [
            { label: "Администратор", value: "admin" },
            { label: "Пользователь", value: "user" },
          ],
        },
        {
          label: "ФИО*",
          type: "text",
          placeholder: "Сидоров Иван Петрович",
          value: fio,
          onChange: setFio,
        },
        {
          label: "Email администратора*",
          type: "email",
          placeholder: "admin@admin.ru",
          value: email,
          onChange: setEmail,
        },
      ]}
      onSubmit={() => {
        console.warn("submit", { role, fio, email });
      }}
      onCancel={() => {
        console.warn("cancel");
      }}
    />
  );
};

export default PopupCardWrapper;
