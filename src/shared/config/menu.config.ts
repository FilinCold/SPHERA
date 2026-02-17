import { homeIcon, usersIcon, coursesIcon } from "@/shared/assets";
import { PAGES } from "@/shared/config/pages.config";

export const MENU = [
  { href: PAGES.HOME, name: "Пространство", icon: homeIcon },
  { href: PAGES.CANDIDATES, name: "Кандидаты", icon: usersIcon },
  { href: PAGES.COURSES, name: "Все курсы", icon: coursesIcon },
];
