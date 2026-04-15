/* Коротко: ты добавляешь новую страницу в TITLE_BAR_CONFIG_BY_ROUTE, а DEFAULT_TITLE_BAR_CONFIG — это fallback, если маршрут не найден.

Что делать пошагово
Создай страницу в src/app/.../page.tsx, например src/app/reports/page.tsx (роут будет /reports).
Открой src/shared/config/barConfig.config.ts (или текущий единый конфиг).
Добавь новый ключ в TITLE_BAR_CONFIG_BY_ROUTE с точным путём:
"/reports": {
  title: "Отчеты",
  breadcrumbs: [
    { label: "Главная", href: "/" },
    { label: "Отчеты" },
  ],
  searchPlaceholder: "Поиск по отчетам",
  actionText: "Создать отчет",
  actionHref: "/reports/create",
  // hideActionButton: true, // если кнопка не нужна
},
Что означают поля
title — заголовок страницы.
breadcrumbs — хлебные крошки.
searchPlaceholder — placeholder у поиска (и в TitleBar, и в SearchBar, раз конфиг общий).
actionText — текст кнопки справа.
actionHref — ссылка кнопки.
hideActionButton — скрыть кнопку (обычно для страниц редактирования/форм).
Важно
Ключ маршрута должен точно совпадать с pathname (/edit-data, /users-list, и т.д.).
Если запись не добавить — компоненты возьмут DEFAULT_TITLE_BAR_CONFIG. */
export type RouteConfig = {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  searchPlaceholder: string;
  actionText?: string;
  actionHref?: string;
  hideActionButton?: boolean;
};

export const DEFAULT_TITLE_BAR_CONFIG: RouteConfig = {
  title: "Раздел",
  breadcrumbs: [{ label: "Главная", href: "/" }, { label: "Раздел" }],
  searchPlaceholder: "Поиск",
  actionText: "Создать",
};

export const TITLE_BAR_CONFIG_BY_ROUTE: Record<string, RouteConfig> = {
  "/company-space": {
    title: "Пространства",
    breadcrumbs: [{ label: "Главная", href: "/" }, { label: "Пространства" }],
    searchPlaceholder: "Поиск по пространствам",
    actionText: "Добавить пространство",
    actionHref: "/made-space",
  },
  "/course-main": {
    title: "Курсы",
    breadcrumbs: [{ label: "Главная", href: "/" }, { label: "Курсы" }],
    searchPlaceholder: "Поиск по курсам",
    actionText: "Создать курс",
  },
  "/edit-data": {
    title: "Редактирование данных",
    breadcrumbs: [
      { label: "Главная", href: "/" },
      { label: "Пространства", href: "/company-space" },
      { label: "Редактирование данных" },
    ],
    searchPlaceholder: "Поиск по данным",
    hideActionButton: true,
  },
  "/edit-space": {
    title: "Редактирование пространства",
    breadcrumbs: [
      { label: "Главная", href: "/" },
      { label: "Пространства", href: "/company-space" },
      { label: "Редактирование пространства" },
    ],
    searchPlaceholder: "Поиск по пространству",
    hideActionButton: true,
  },
  "/made-space": {
    title: "Новое пространство",
    breadcrumbs: [
      { label: "Главная", href: "/" },
      { label: "Пространства", href: "/company-space" },
      { label: "Создание пространства" },
    ],
    searchPlaceholder: "Поиск",
    hideActionButton: true,
  },
  "/users-list": {
    title: "Сотрудники",
    breadcrumbs: [{ label: "Главная", href: "/" }, { label: "Сотрудники" }],
    searchPlaceholder: "Поиск по сотрудникам",
    actionText: "Добавить сотрудника",
    actionHref: "/edit-data",
  },
};
