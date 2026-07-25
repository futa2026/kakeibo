import type { Category } from "./types";

export const EXPENSE_CATEGORIES: Category[] = [
  { id: "food", label: "食費(식비)", type: "expense", color: "var(--series-1)" },
  { id: "daily", label: "日用品(생활용품)", type: "expense", color: "var(--series-2)" },
  { id: "transport", label: "交通費(교통비)", type: "expense", color: "var(--series-3)" },
  { id: "entertainment", label: "娯楽(오락비)", type: "expense", color: "var(--series-4)" },
  { id: "medical", label: "医療(의료비)", type: "expense", color: "var(--series-5)" },
  { id: "housing", label: "住居(주거비)", type: "expense", color: "var(--series-6)" },
  { id: "communication", label: "通信(통신비)", type: "expense", color: "var(--series-7)" },
  { id: "other_expense", label: "その他(기타)", type: "expense", color: "var(--series-8)" },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: "salary", label: "給与(급여)", type: "income", color: "var(--series-1)" },
  { id: "side_job", label: "副業(부업)", type: "income", color: "var(--series-3)" },
  { id: "other_income", label: "その他収入(기타 수입)", type: "income", color: "var(--series-8)" },
];

export const ALL_CATEGORIES: Category[] = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategory(id: string): Category | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}
