export interface UsersResponseVm {
  id: string;
  email: string;
  countryCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  document: string;
  isBlocked: boolean;
  withdrawBlocked: boolean;
  verified: boolean;
  isSecondFactorEnabled: boolean;
  complianceKycStatus: string;
  information: {
    cpf: string;
    birthday: string;
    bussinessName: string;
    fantasyName: string;
    cnpj: string;
    incorporationDate: string;
    motherName: string;
  };
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface UserAdminDto {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  roles: string[];
}
