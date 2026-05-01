export type UserStatus = "active" | "blocked" | "awaiting";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: UserStatus;
}
