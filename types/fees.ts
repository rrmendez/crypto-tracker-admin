import { z } from "zod";

export const feeSchema = z.object({
  currencyId: z.string().optional(),
  operation: z.string().min(1, { message: "La operación es obligatoria" }),
  type: z.string().min(1, { message: "El tipo de tasa es obligatorio" }),
  value: z.union([z.number(), z.string()]).refine(
    (val) => {
      if (val === undefined || val === null) return true;
      const num = typeof val === "number" ? val : Number(val);
      return !isNaN(num);
    },
    {
      message: "El valor no es un número válido",
    }
  ),
  isActive: z.boolean(),
});

export type UpdateFeeDto = z.infer<typeof feeSchema>;

export type Fee = {
  id: string;
  operation: SystemOperation;
  currency: {
    id: string;
    code: string;
    name: string;
    network?: string;
  };
  type: FeeType;
  value: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};

export enum FeeType {
  FIXED = "FIXED",
  PERCENT = "PERCENT",
}

export enum SystemOperation {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  EXCHANGE = "EXCHANGE",
  SALE = "SALE",
  PAYMENT = "PAYMENT",
}
