"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import {
  DEFAULT_TITLE_BAR_CONFIG,
  TITLE_BAR_CONFIG_BY_ROUTE,
} from "@/shared/config/barConfig.config";

import styles from "./TitleBar.module.scss";

import type { TitleBarProps } from "./types";

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  breadcrumbs,
  breadcrumbSeparator = " / ",
  appearance = "default",
  className,
  searchPlaceholder,
  onSearch,
  actionText,
  actionHref,
  hideActionButton,
  onCreateClick,
}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const routeConfig = TITLE_BAR_CONFIG_BY_ROUTE[pathname] ?? DEFAULT_TITLE_BAR_CONFIG;
  const resolvedTitle = title ?? routeConfig.title;
  const resolvedSearchPlaceholder = searchPlaceholder ?? routeConfig.searchPlaceholder;
  const resolvedActionText = actionText ?? routeConfig.actionText ?? "Создать";
  const resolvedActionHref = actionHref ?? routeConfig.actionHref;
  const shouldHideActionButton = hideActionButton ?? routeConfig.hideActionButton ?? false;
  const useButtonAction = Boolean(onCreateClick) || !resolvedActionHref;

  const handleSearch = () => {
    if (!query.trim()) {
      alert("Введите текст для поиска");

      return;
    }

    onSearch?.(query);
  };

  const safeBreadcrumbs =
    breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : routeConfig.breadcrumbs;

  const isSpaceEdit = appearance === "spaceEdit";

  return (
    <div className={clsx(styles.wrapper, isSpaceEdit && styles.wrapperSpaceEdit, className)}>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={clsx(styles.breadcrumbs, isSpaceEdit && styles.breadcrumbsSpaceEdit)}>
            {safeBreadcrumbs.map((b, i) => (
              <span key={i}>
                {b.href ? <Link href={b.href}>{b.label}</Link> : <span>{b.label}</span>}
                {i < safeBreadcrumbs.length - 1 && breadcrumbSeparator}
              </span>
            ))}
          </div>

          <div className={clsx(styles.title, isSpaceEdit && styles.titleSpaceEdit)}>
            {resolvedTitle}
          </div>
        </div>

        {!isSpaceEdit ? (
          <div className={styles.right}>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                placeholder={resolvedSearchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
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
            </div>

            {!shouldHideActionButton &&
              (useButtonAction ? (
                <button
                  className={`${styles.button} ${styles.primary}`}
                  onClick={() => {
                    if (onCreateClick) {
                      onCreateClick();
                    }
                  }}
                >
                  {resolvedActionText}
                </button>
              ) : (
                <Link href={resolvedActionHref} className={`${styles.button} ${styles.primary}`}>
                  {resolvedActionText}
                </Link>
              ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TitleBar;
