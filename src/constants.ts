import type { Category } from "./types";

export const EXPENSE_CATEGORIES: Category[] = [
  { id: "food", label: "食費", type: "expense", color: "var(--series-1)" },
  { id: "daily", label: "日用品", type: "expense", color: "var(--series-2)" },
  { id: "transport", label: "交通費", type: "expense", color: "var(--series-3)" },
  { id: "entertainment", label: "娯楽", type: "expense", color: "var(--series-4)" },
  { id: "medical", label: "医療", type: "expense", color: "var(--series-5)" },
  { id: "housing", label: "住居", type: "expense", color: "var(--series-6)" },
  { id: "communication", label: "通信", type: "expense", color: "var(--series-7)" },
  { id: "other_expense", label: "その他", type: "expense", color: "var(--series-8)" },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: "salary", label: "給与", type: "income", color: "var(--series-1)" },
  { id: "side_job", label: "副業", type: "income", color: "var(--series-3)" },
  { id: "other_income", label: "その他収入", type: "income", color: "var(--series-8)" },
];

export const ALL_CATEGORIES: Category[] = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategory(id: string): Category | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}
