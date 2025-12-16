export type PaginationResponse<T> = {
  total: number;
  page: number;
  limit: number;
  data: T[];
};

export type PaginationRequest = {
  page: number;
  limit: number;
  types?: string;
  status?: string;
  walletId?: string;
  symbol?: string;
  currencyCode?: string;
  showExtras?: boolean;
  username?: string;
  from?: string;
  to?: string;
  createdAt?: string;
  email?: string;
  orderBy?: string;
  order?: string;
  type?: string;
  operation?: string;
  composerSearch?: string;
  verified?: boolean;
  isBlocked?: boolean;
  roles?: string;
  currencyId?: string;
  complianceKycStatus?: string;
};
