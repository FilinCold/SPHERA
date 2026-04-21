export type CompanyStatus = "active" | "inactive";

export interface CompanyCardProps {
  id?: string;
  name?: string;
  subscriptionDate?: string;
  status?: CompanyStatus;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  companySlug?: string;
}
