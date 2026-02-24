export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginFormErrors = {
  email: string;
  password: string;
};

export type ForgotPasswordSteps = "none" | "email" | "reset";

export type ForgotPasswordValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordErrors = {
  email: string;
  password: string;
  confirmPassword: string;
};
