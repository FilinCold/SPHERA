export type CourseStatus = "active" | "archived" | "deleted";

export interface UserAvatar {
  id: number;
  avatar: string;
}

export interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  status: CourseStatus;
  usersCount: number;
  date: string;
  link: string;
  users?: UserAvatar[];
}
export type CompanyStatus = "active" | "inactive";

export interface CompanyCardProps {
  id?: string;
  name?: string;
  subscriptionDate?: string;
  status?: CompanyStatus;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  companyId?: string;
}
