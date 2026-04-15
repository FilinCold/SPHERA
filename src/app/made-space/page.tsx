import { SimpleCard } from "@/shared/components/SimpleCard/SimpleCard";
import TitleBar from "@/shared/components/TitleBar/TitleBar";

export default function MadeSpacePage() {
  return (
    <>
      <TitleBar />

      <SimpleCard
        title="Новое пространство"
        fields={[
          { name: "name", label: "Имя*", placeholder: "Введите имя" },
          { name: "fio", label: "ФИО*", placeholder: "Введите ФИО" },
          {
            name: "email",
            label: "Email администратора*",
            type: "email",
            placeholder: "Введите email",
          },
          {
            name: "date",
            label: "Дата подписки",
            type: "text",
            placeholder: "__.__.____",
          },
        ]}
      />
    </>
  );
}
