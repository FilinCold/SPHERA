export type Breadcrumb = {
  label: string;
  href?: string;
};

export interface TitleBarProps {
  title?: string;
  breadcrumbs?: Breadcrumb[];

  searchPlaceholder?: string;
  onSearch?: (query: string) => void;

  actionText?: string;
  actionHref?: string;
  hideActionButton?: boolean;
  onCreateClick?: () => void;
}
