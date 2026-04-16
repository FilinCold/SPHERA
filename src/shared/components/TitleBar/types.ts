export type Breadcrumb = {
  label: string;
  href?: string;
};

export type TitleBarAppearance = "default" | "spaceEdit";

export interface TitleBarProps {
  title?: string;
  breadcrumbs?: Breadcrumb[];
  /** Разделитель между элементами крошек. По умолчанию « / ». */
  breadcrumbSeparator?: string;
  /** Визуальный вариант шапки страницы (например экран пространства по макету). */
  appearance?: TitleBarAppearance;
  className?: string;

  searchPlaceholder?: string;
  onSearch?: (query: string) => void;

  actionText?: string;
  actionHref?: string;
  hideActionButton?: boolean;
  onCreateClick?: () => void;
}
