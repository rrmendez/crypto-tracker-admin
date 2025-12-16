export enum ROLE {
  USER = "user",
  MERCHANT = "merchant",
}

export type Role = `${ROLE}`;

export type SignInParams = {
  email: string;
  password: string;
};

export type RegisterParams = {
  accept: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: Role[];
};

export type ForgotPasswordParams = {
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};
