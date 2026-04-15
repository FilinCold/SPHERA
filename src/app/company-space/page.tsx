import CompanyCard from "@/shared/components/CompanyCard/CompanyCard";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";

const companies = [
  {
    id: "1",
    href: "/edit-space",
    name: "ООО Ромашка",
    subscriptionDate: "12.12.2022",
    status: "active" as const,
  },
  {
    id: "2",
    href: "/edit-space",
    name: "ООО Василек",
    subscriptionDate: "10.01.2023",
    status: "inactive" as const,
  },
  {
    id: "3",
    href: "/edit-space",
    name: "ООО Лилия",
    subscriptionDate: "05.03.2023",
    status: "active" as const,
  },
  {
    id: "4",
    href: "/edit-space",
    name: "ООО Пион",
    subscriptionDate: "22.07.2023",
    status: "active" as const,
  },
];

export default function CompanySpacePage() {
  return (
    <>
      <SearchBar
        buttonText="Добавить протранство"
        buttonLink="/made-space"
        searchPlaceholder="Поиск по сотрудникам"
        title="Пространства"
      />

      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          href={company.href}
          name={company.name}
          subscriptionDate={company.subscriptionDate}
          status={company.status}
        />
      ))}
    </>
  );
}
