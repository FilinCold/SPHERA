"use client";

import Link from "next/link";
import React, { useState } from "react";

import styles from "./SearchBar.module.scss";

import type { SearchBarProps, SearchParams } from "./types";

export const SearchBar: React.FC<SearchBarProps> = ({
  title = "ООО Ромашка",
  breadcrumbs,
  totalCount = 0,
  searchPlaceholder = "Поиск",
  shopOptions = [],
  organizationOptions = [],
}) => {
  const [query, setQuery] = useState("");
  const [shop, setShop] = useState<string | undefined>();
  const [organization, setOrganization] = useState<string | undefined>();

  const [shopOpen, setShopOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);

  const [filtersVisible, setFiltersVisible] = useState(true);

  const handleSearch = () => {
    if (!query && !shop && !organization) {
      alert("Введите данные для поиска");

      return;
    }

    const params: SearchParams = {
      query,
      ...(shop ? { shop } : {}),
      ...(organization ? { organization } : {}),
    };

    // onSearch(params);
  };

  // fallback чтобы всегда были хлебные крошки
  const safeBreadcrumbs =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : [{ label: "Главная", href: "/" }, { label: "Сотрудники" }];

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.left}>
          {/* ✅ ХЛЕБНЫЕ КРОШКИ С ЛОГИКОЙ ПЕРЕХОДА */}
          <div className={styles.breadcrumbs}>
            {safeBreadcrumbs.map((b, i) => (
              <span key={i}>
                {b.href ? <Link href={b.href}>{b.label}</Link> : <span>{b.label}</span>}
                {i < safeBreadcrumbs.length - 1 && " / "}
              </span>
            ))}
          </div>

          <div className={styles.title}>{title}</div>
        </div>

        <div className={styles.right}>
          <div className={styles.inputWrapper}>
            <span className={styles.icon}>🔍</span>
            <input
              className={styles.input}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>

          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={() => alert("Переход на страницу добавления")}
          >
            Добавить сотрудника
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className={`${styles.filtersRow} ${!filtersVisible ? styles.hidden : ""}`}>
        {/* SHOP */}
        <div className={styles.select}>
          <div className={styles.selectButton} onClick={() => setShopOpen(!shopOpen)}>
            {shop ? shopOptions.find((o) => o.value === shop)?.label : "Все точки"}
          </div>

          {shopOpen && (
            <div className={styles.dropdown}>
              {shopOptions.map((o) => (
                <div
                  key={o.value}
                  className={styles.option}
                  onClick={() => {
                    setShop(o.value);
                    setShopOpen(false);
                  }}
                >
                  {o.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ORGANIZATION */}
        <div className={styles.select}>
          <div className={styles.selectButton} onClick={() => setOrgOpen(!orgOpen)}>
            {organization
              ? organizationOptions.find((o) => o.value === organization)?.label
              : "Все организации"}
          </div>

          {orgOpen && (
            <div className={styles.dropdown}>
              {organizationOptions.map((o) => (
                <div
                  key={o.value}
                  className={styles.option}
                  onClick={() => {
                    setOrganization(o.value);
                    setOrgOpen(false);
                  }}
                >
                  {o.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className={`${styles.button} ${styles.secondary}`} onClick={handleSearch}>
          Найти
        </button>
      </div>

      {/* BOTTOM */}
      <div className={styles.bottomRow}>
        <div className={styles.count}>Найдено {totalCount}</div>

        <div className={styles.toggle} onClick={() => setFiltersVisible(!filtersVisible)}>
          {filtersVisible ? "Скрыть фильтры" : "Раскрыть фильтры"}
        </div>
      </div>
    </div>
  );
};
