"use client";

import { observer } from "mobx-react-lite";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/shared/components/Button/Button";
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
    searchAriaLabel,
    onSearch,
    shopOptions = [],
    organizationOptions = [],
    shopFilterLabel = "Торговая точка",
    organizationFilterLabel = "Организация",
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
                <span className={styles.breadcrumb} key={i}>
                  {b.href ? <Link href={b.href}>{b.label}</Link> : <span>{b.label}</span>}
                </span>
              ))}
            </div>

            <div className={styles.title}>{resolvedTitle}</div>
          </div>

          <div className={styles.right}>
            <div className={styles.inputWrapper}>
              <input
                aria-label={searchAriaLabel ?? "Поиск"}
                className={styles.input}
                placeholder={resolvedSearchPlaceholder}
                value={store.query}
                onChange={(e) => store.setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <button className={styles.iconButton} type="button" onClick={handleSearch}>
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
              </button>
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
            <button className={styles.selectButton} type="button" onClick={store.toggleShopOpen}>
              <span className={styles.selectLabel}>{shopFilterLabel}</span>
              <span className={styles.selectValue}>{store.getShopLabel(shopOptions)}</span>
              <span className={styles.selectArrow}>⌄</span>
            </button>

            {store.shopOpen && shopOptions.length > 0 && (
              <div className={styles.dropdown}>
                {shopOptions.map((o) => (
                  <button
                    key={o.value}
                    className={styles.option}
                    type="button"
                    onClick={() => {
                      store.setShop(o.value);
                      store.setShopOpen(false);
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.select}>
            <button className={styles.selectButton} type="button" onClick={store.toggleOrgOpen}>
              <span className={styles.selectLabel}>{organizationFilterLabel}</span>
              <span className={styles.selectValue}>
                {store.getOrganizationLabel(organizationOptions)}
              </span>
              <span className={styles.selectArrow}>⌄</span>
            </button>

            {store.orgOpen && organizationOptions.length > 0 && (
              <div className={styles.dropdown}>
                {organizationOptions.map((o) => (
                  <button
                    key={o.value}
                    className={styles.option}
                    type="button"
                    onClick={() => {
                      store.setOrganization(o.value);
                      store.setOrgOpen(false);
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button className={`${styles.button} ${styles.secondary}`} onClick={handleSearch}>
            Найти
          </Button>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.count}>Найдено {totalCount}</div>

          <button className={styles.toggle} onClick={store.toggleFiltersVisible} type="button">
            {store.filtersVisible ? "Скрыть фильтр ⌃" : "Показать фильтр ⌄"}
          </button>
        </div>
      </div>
    );
  },
);
