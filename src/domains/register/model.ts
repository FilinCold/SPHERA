export type RegistrationFormValues = {
  password: string;
  confirmPassword: string;
};

export type RegistrationFormErrors = {
  password: string;
  confirmPassword: string;
};

export type RegistrationInvite = {
  email: string;
  role: string;
  companyName: string;
};

export type CompleteRegistrationPayload = {
  password: string;
  repeatPassword: string;
};
