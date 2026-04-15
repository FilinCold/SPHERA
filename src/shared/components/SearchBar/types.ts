export interface Option {
  label: string;
  value: string;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface SearchParams {
  query: string;
  shop?: string;
  organization?: string;
}

export interface SearchBarProps {
  title?: string;
  breadcrumbs?: Breadcrumb[];
  totalCount?: number;
  searchPlaceholder?: string;
  onSearch?: (params: SearchParams) => void;
  shopOptions?: Option[];
  organizationOptions?: Option[];
  buttonText?: string;
  buttonLink?: string;
  hideActionButton?: boolean;
}
