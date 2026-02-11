export type RegistrationFormValues = {
  name: string;
  password: string;
  confirmPassword: string;
  checkAgreement: boolean;
};

export type RegistrationFormErrors = {
  name: string;
  password: string;
  confirmPassword: string;
  checkAgreement: string;
};
