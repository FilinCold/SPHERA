"use client";

import { useRouter } from "next/navigation";

import { SimpleCard } from "@/shared/components/SimpleCard/SimpleCard";
import type { FormData } from "@/shared/components/SimpleCard/types";
import TitleBar from "@/shared/components/TitleBar/TitleBar";

export default function EditDataPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/company-space");
  };

  const handleSubmit = (data: FormData) => {
    console.log("Данные формы:", data);
    /*
    // Пример реального запроса на сохранение данных заявки
    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    */
  };

  return (
    <>
      <TitleBar />
      <SimpleCard
        title="Данные заявки"
        fields={[
          {
            name: "firstName",
            label: "Имя",
            placeholder: "Введите имя",
          },
          {
            name: "status",
            label: "Статус",
            type: "select",
            options: [
              { label: "Активно", value: "active" },
              { label: "Приостановлено", value: "paused" },
            ],
          },
          {
            name: "date",
            label: "Период",
            type: "dateRange",
          },
        ]}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </>
  );
}
