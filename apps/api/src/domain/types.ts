export const BorrowerTypes = ["INDIVIDUAL", "BUSINESS"] as const;
export type BorrowerType = (typeof BorrowerTypes)[number];

export const InterestMethods = ["FLAT", "REDUCING_BALANCE"] as const;
export type InterestMethod = (typeof InterestMethods)[number];

export const RepaymentFrequencies = [
  "DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "CUSTOM"
] as const;
export type RepaymentFrequency = (typeof RepaymentFrequencies)[number];

export const PaymentMethods = [
  "CASH", "BANK_TRANSFER", "CARD", "MTN_MOMO", "AIRTEL_MONEY", "ZAMTEL_MONEY", "OTHER"
] as const;
export type PaymentMethod = (typeof PaymentMethods)[number];

export interface Money {
  amount: string;
  currency: string;
}

export interface TenantContext {
  organisationId: number;
  userId: number;
  roleCodes: string[];
}
