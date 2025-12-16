export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  avatar: string;
  roles: string[];
  isSecondFactorEnabled: boolean;
};
