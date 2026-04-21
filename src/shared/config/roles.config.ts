import { MENU, type MenuItemConfig, type NavItemId } from "./menu.config";
import { PAGES } from "./pages.config";

/** Роли для RBAC (включая неавторизованного). */
export type AppRole = "superadmin" | "admin" | "user" | "candidate" | "guest";

/** Роль из сессии/API (до нормализации в AppRole). */
export type SessionRole = "superadmin" | "admin" | "user" | "candidate" | "unrecognized";

export const normalizeRoleCandidate = (roleCandidate: string): SessionRole => {
  const normalized = roleCandidate
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  if (normalized === "superadmin") {
    return "superadmin";
  }

  if (
    normalized === "admin" ||
    normalized === "companyadmin" ||
    normalized === "tenantadmin" ||
    normalized === "companyadministrator"
  ) {
    return "admin";
  }

  if (
    normalized === "user" ||
    normalized === "hr" ||
    normalized === "companyuser" ||
    normalized === "companyhr"
  ) {
    return "user";
  }

  if (normalized === "candidate") {
    return "candidate";
  }

  return "unrecognized";
};

/**
 * Эффективная роль для меню и RBAC.
 * Неизвестная роль → guest (минимальные права). Подписка обрабатывается отдельно в guard/store.
 */
export const getAppRoleFromSessionUser = (
  user: { role: SessionRole; workspaceSuspended?: boolean } | null,
): AppRole => {
  if (!user) {
    return "guest";
  }

  if (user.workspaceSuspended) {
    return "guest";
  }

  if (user.role === "unrecognized") {
    return "guest";
  }

  return user.role;
};

/**
 * Меню: админ компании в пространстве (tenant) — операционный доступ.
 * Суперадмин (сотрудник LMS / платформы) — уже в вашей матрице: только «Пространство» и «Пользователи».
 */
const TENANT_COMPANY_ADMIN_NAV: readonly NavItemId[] = ["space", "users", "candidates", "courses"];
const TENANT_COMPANY_USER_NAV: readonly NavItemId[] = ["space", "users", "candidates", "courses"];

/** Сотрудник LMS: управление пространствами, подписками и т.п. — без разделов tenant-операций в меню. */
const LMS_PLATFORM_SUPERADMIN_NAV: readonly NavItemId[] = ["space"];

/**
 * Доступные пункты навигации по роли (ключи пунктов меню).
 */
export const NAV_BY_ROLE: Record<AppRole, readonly NavItemId[]> = {
  superadmin: LMS_PLATFORM_SUPERADMIN_NAV,
  admin: TENANT_COMPANY_ADMIN_NAV,
  user: TENANT_COMPANY_USER_NAV,
  candidate: ["courses"],
  guest: [],
};

/**
 * Защищённые префиксы и точные пути: кто может заходить.
 * Длинные префиксы проверяются раньше. `/` — только главная «Пространство».
 */
type RouteRule = {
  prefix: string;
  /** если true — только точное совпадение с prefix */
  exact?: boolean;
  roles: readonly AppRole[];
};

/** Маршруты: superadmin платформы не ходит в операционные HR-разделы tenant (кандидаты/курсы), как в вашей routeAccess. */
const ROUTE_RULES: readonly RouteRule[] = [
  { prefix: PAGES.MADE_SPACE, roles: ["superadmin"] },
  { prefix: PAGES.SPACE, roles: ["admin", "user"] },
  { prefix: PAGES.EDIT_SPACE, roles: ["superadmin"] },
  { prefix: PAGES.COMPANY_SPACE, roles: ["superadmin"] },
  { prefix: PAGES.STATISTICS, roles: ["superadmin", "admin", "user"] },
  { prefix: "/candidates", roles: ["admin", "user"] },
  { prefix: "/courses", roles: ["admin", "user"] },
  { prefix: "/users", roles: ["admin", "user"] },
  { prefix: "/todos", roles: ["superadmin", "admin", "user"] },
];

/** Кандидат: только публичный сценарий приложения (без админских разделов). */
const CANDIDATE_PATH_PREFIXES: readonly string[] = [PAGES.COURSES];

const isPathUnderPrefix = (pathname: string, prefix: string, exact: boolean): boolean => {
  if (exact) {
    return pathname === prefix || (prefix === "/" && pathname === "");
  }

  return pathname === prefix || pathname.startsWith(`${prefix}/`);
};

/**
 * Чистая функция: может ли роль открыть путь (без учёта публичных роутов и guest-редиректов).
 * `guest` — всегда false (гостю разрешены только публичные страницы снаружи).
 */
export const canAccessRoute = (role: AppRole, pathname: string): boolean => {
  if (role === "guest") {
    return false;
  }

  if (role === "candidate") {
    return CANDIDATE_PATH_PREFIXES.some((p) => isPathUnderPrefix(pathname, p, false));
  }

  for (const rule of ROUTE_RULES) {
    if (!isPathUnderPrefix(pathname, rule.prefix, rule.exact ?? false)) {
      continue;
    }

    return rule.roles.includes(role);
  }

  return true;
};

/** Пункты меню, доступные роли (по конфигу MENU). */
export const getAvailableNav = (role: AppRole): readonly MenuItemConfig[] => {
  const allowed = NAV_BY_ROLE[role];

  const available = MENU.filter((item) => allowed.includes(item.id));

  if (role !== "superadmin") {
    return available;
  }

  return available.map((item) =>
    item.id === "space" ? { ...item, href: PAGES.COMPANY_SPACE, name: "Пространства" } : item,
  );
};

/** Куда увести пользователя, если текущий URL ему недоступен. */
export const getFallbackPathForRole = (role: AppRole): string => {
  /** Платформенный суперадмин: список пространств, не форма создания (`/made-space`). */
  if (role === "superadmin") {
    return PAGES.COMPANY_SPACE;
  }

  const nav = getAvailableNav(role);

  const first = nav[0];

  if (first) {
    return first.href;
  }

  if (role === "candidate") {
    return PAGES.COURSES;
  }

  return PAGES.FORBIDDEN;
};
