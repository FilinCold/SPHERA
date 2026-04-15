"use client";

import { observer } from "mobx-react-lite";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import {
  DEFAULT_TITLE_BAR_CONFIG,
  TITLE_BAR_CONFIG_BY_ROUTE,
} from "@/shared/config/barConfig.config";

import styles from "./SearchBar.module.scss";
import { SearchBarStore } from "./SearchBar.store";

import type { SearchBarProps } from "./types";

export const SearchBar: React.FC<SearchBarProps> = observer(
  ({
    title,
    breadcrumbs,
    totalCount = 0,
    searchPlaceholder,
    onSearch,
    shopOptions = [],
    organizationOptions = [],
    buttonText,
    buttonLink,
    hideActionButton,
  }) => {
    const pathname = usePathname();
    const [store] = useState(() => new SearchBarStore());
    const routeConfig = TITLE_BAR_CONFIG_BY_ROUTE[pathname] ?? DEFAULT_TITLE_BAR_CONFIG;
    const resolvedTitle = title ?? routeConfig.title;
    const resolvedSearchPlaceholder = searchPlaceholder ?? routeConfig.searchPlaceholder;
    const resolvedButtonText = buttonText ?? routeConfig.actionText ?? "Добавить";
    const resolvedButtonLink = buttonLink ?? routeConfig.actionHref ?? "#";
    const shouldHideActionButton = hideActionButton ?? routeConfig.hideActionButton ?? false;

    const handleSearch = () => {
      if (!store.hasFilters) {
        alert("Введите данные для поиска");

        return;
      }

      if (onSearch) {
        onSearch(store.searchParams);
      }
    };

    const safeBreadcrumbs =
      breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : routeConfig.breadcrumbs;

    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.left}>
            <div className={styles.breadcrumbs}>
              {safeBreadcrumbs.map((b, i) => (
                <span key={i}>
                  {b.href ? <Link href={b.href}>{b.label}</Link> : <span>{b.label}</span>}
                  {i < safeBreadcrumbs.length - 1 && " / "}
                </span>
              ))}
            </div>

            <div className={styles.title}>{resolvedTitle}</div>
          </div>

          <div className={styles.right}>
            <div className={styles.inputWrapper}>
              <span className={styles.icon}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 13L19 19M8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15Z"
                    stroke="#0B99C1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                className={styles.input}
                placeholder={resolvedSearchPlaceholder}
                value={store.query}
                onChange={(e) => store.setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>

            {!shouldHideActionButton && (
              <Link href={resolvedButtonLink} className={`${styles.button} ${styles.primary}`}>
                {resolvedButtonText}
              </Link>
            )}
          </div>
        </div>

        <div className={`${styles.filtersRow} ${!store.filtersVisible ? styles.hidden : ""}`}>
          <div className={styles.select}>
            <div className={styles.selectButton} onClick={store.toggleShopOpen}>
              {store.getShopLabel(shopOptions)}
            </div>

            {store.shopOpen && (
              <div className={styles.dropdown}>
                {shopOptions.map((o) => (
                  <div
                    key={o.value}
                    className={styles.option}
                    onClick={() => {
                      store.setShop(o.value);
                      store.setShopOpen(false);
                    }}
                  >
                    {o.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.select}>
            <div className={styles.selectButton} onClick={store.toggleOrgOpen}>
              {store.getOrganizationLabel(organizationOptions)}
            </div>

            {store.orgOpen && (
              <div className={styles.dropdown}>
                {organizationOptions.map((o) => (
                  <div
                    key={o.value}
                    className={styles.option}
                    onClick={() => {
                      store.setOrganization(o.value);
                      store.setOrgOpen(false);
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

        <div className={styles.bottomRow}>
          <div className={styles.count}>Найдено {totalCount}</div>

          <div className={styles.toggle} onClick={store.toggleFiltersVisible}>
            {store.filtersVisible ? "Скрыть фильтры" : "Раскрыть фильтры"}
          </div>
        </div>
      </div>
    );
  },
);
