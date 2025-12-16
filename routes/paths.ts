// ----------------------------------------------------------------------

export const paths = {
  index: "/",
  // AUTH
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  // ERROR
  error: {
    404: "/404",
    500: "/500",
    403: "/403",
  },
  // DASHBOARD
  dashboard: {
    root: "/dashboard",
  },
  clients: {
    root: "/clients",
    details: (id: string) => `/clients/${id}`,
    kycDetals: (clientId: string, id: string) => `/clients/${clientId}/kycs/${id}`,
    config: (id: string) => `/clients/${id}/config`,
    walletsLis: (id: string) => `/clients/${id}/wallets`,
    walletsDetails: (clientId: string, walletId: string) =>
      `/clients/${clientId}/wallets/${walletId}`,
  },
  sales: {
    root: "/sales",
    details: (id: string) => `/sales/${id}`,
  },
  users: {
    root: "/users",
    details: (id: string) => `/users/${id}/details`,
    create: "/users/create",
    edit: (id: string) => `/users/${id}/edit`,
  },
  settings: {
    root: "/settings",
    currencies: {
      root: "/settings/currencies",
      details: (id: string) => `/settings/currencies/${id}/details`,
      edit: (id: string) => `/settings/currencies/${id}/edit`,
      create: "/settings/currencies/create",
    },
    fees: {
      root: "/settings/fees",
      details: (id: string) => `/settings/fees/${id}/details`,
      edit: (id: string) => `/settings/fees/${id}/edit`,
      create: "/settings/fees/create",
    },
    limits: {
      root: "/settings/limits",
      details: (id: string) => `/settings/limits/${id}/details`,
      edit: (id: string) => `/settings/limits/${id}/edit`,
      create: "/settings/limits/create",
    },
  },
  // PROFILE
  profile: {
    root: `profile`,
  },
  // TRANSACTIONS
  transactions: {
    root: "/transactions",
    deposits: {
      root: "/transactions/deposits",
      details: (id: string) => `/transactions/deposits/${id}/details`,
    },
    withdrawals: {
      root: "/transactions/withdrawals",
      details: (id: string) => `/transactions/withdrawals/${id}/details`,
    },
  },
  //Compliance
  compliance: {
    root: "/compliance",
    details: (id: string) => `/compliance/${id}`,
  },
};
