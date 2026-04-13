import { homeIcon, usersIcon, coursesIcon } from "@/shared/assets";
import { PAGES } from "@/shared/config/pages.config";

import type { StaticImageData } from "next/image";

export type NavItemId = "space" | "users" | "candidates" | "courses";

export type MenuItemConfig = {
  id: NavItemId;
  href: string;
  name: string;
  icon: StaticImageData;
};

export const MENU: readonly MenuItemConfig[] = [
  { id: "space", href: PAGES.HOME, name: "Пространство", icon: homeIcon },
  { id: "users", href: PAGES.USERS, name: "Пользователи", icon: usersIcon },
  { id: "candidates", href: PAGES.CANDIDATES, name: "Кандидаты", icon: usersIcon },
  { id: "courses", href: PAGES.COURSES, name: "Курсы", icon: coursesIcon },
];
