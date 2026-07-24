export type TransactionType = "expense" | "income";

export interface Category {
  id: string;
  label: string;
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string; // YYYY-MM-DD
  amount: number; // KRW
  categoryId: string;
  memo: string;
}

export type Budgets = Record<string, number>; // categoryId -> monthly limit (KRW)

export interface FxRate {
  rate: number; // JPY per 1 KRW
  date: string; // YYYY-MM-DD, the rate's reference date
}
