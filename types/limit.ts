export type Limit = {
  id: string;
  operation: "DEPOSIT" | "WITHDRAWAL" | string;
  currencyCode: string;
  minimumPerOperation: number;
  maximumPerOperation: number;
  maximumPerOperationAtNight: number;
  maximumPerOperationValidated: number;
  maximumPerOperationAtNightValidated: number;
  maximumPerMonth: number;
  maximumPerMonthValidated: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type CreateLimitDto = Partial<Limit>;
export type UpdateLimitDto = Partial<Limit>;

export enum OperationType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  EXCHANGE = "EXCHANGE",
  SALE = "SALE",
  PAYMENT = "PAYMENT",
}

export type SystemOperation = OperationType[];
