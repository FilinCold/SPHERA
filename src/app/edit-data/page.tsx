"use client";

import { useRouter } from "next/navigation";

import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
import { SimpleCard } from "@/shared/components/SimpleCard/SimpleCard";
import type { FormData } from "@/shared/components/SimpleCard/types";

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
      <SearchBar />
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
