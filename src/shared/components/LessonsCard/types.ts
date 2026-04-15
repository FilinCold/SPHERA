export type LessonsCardStatus = "active" | "inactive";

export type LessonsCardProps = {
  title: string;
  status: LessonsCardStatus;
  href?: string;
  target?: "_self" | "_blank";
};
