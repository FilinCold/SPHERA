import type { StaticImageData } from "next/image";

export interface IMenuItem {
  href: string;
  name: string;
  icon?: StaticImageData;
}

export interface Props {
  menuItem: IMenuItem;
  isActive: boolean;
  className?: string | undefined;
}
