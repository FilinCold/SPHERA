"use client";

import { AdminCard } from "@/shared/components/AdminCard/AdminCard";
import type { AdminField } from "@/shared/components/AdminCard/types";
import { SimpleCard } from "@/shared/components/SimpleCard/SimpleCard";
import type { InputField } from "@/shared/components/SimpleCard/types";
import TitleBar from "@/shared/components/TitleBar/TitleBar";

const adminFields: AdminField[] = [
  {
    name: "firstName",
    label: "Имя*",
    placeholder: "Введите имя",
  },
  {
    name: "lastName",
    label: "Фамилия*",
    placeholder: "Введите фамилию",
  },
  {
    name: "middleName",
    label: "Отчество",
    placeholder: "Введите отчество",
  },
  {
    name: "email",
    label: "Email*",
    type: "email",
    placeholder: "Введите почту",
  },
];

const requestFields: InputField[] = [
  {
    name: "firstName",
    label: "Имя*",
    placeholder: "Введите имя",
  },
  {
    name: "lastName",
    label: "Фамилия*",
    placeholder: "Введите фамилию",
  },
  {
    name: "middleName",
    label: "Отчество",
    placeholder: "Введите отчество",
  },
  {
    name: "email",
    label: "Email*",
    type: "email",
    placeholder: "Введите почту",
  },
];

export default function EditSpacePage() {
  return (
    <>
      <TitleBar />
      <AdminCard title="Данные администратора" fields={adminFields} />
      <SimpleCard title="Данные заявки" fields={requestFields} />
    </>
  );
}
