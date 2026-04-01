"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { CompanyInfo } from "@/shared/components/CompanyInfo/CompanyInfo";
import { useStores } from "@/shared/store";

export const CompanyInfoWidget = observer(() => {
  const { companyStore } = useStores();

  useEffect(() => {
    companyStore.getCompanyInfo();
  }, [companyStore]);

  if (companyStore.isLoading) return <div>Загрузка...</div>;
  if (!companyStore.companyInfo) return <div>Нет данных</div>;

  const { companyName, subscriptionDateFrom, subscriptionDateTo } = companyStore.companyInfo;

  return (
    <CompanyInfo
      companyName={companyName}
      subscriptionDateFrom={subscriptionDateFrom}
      subscriptionDateTo={subscriptionDateTo}
    />
  );
});
