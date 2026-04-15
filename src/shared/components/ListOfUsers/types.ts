export type UserStatus = "active" | "blocked";

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: UserStatus;
}
