import type { Transaction } from "./types";

export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

export function inMonth(t: Transaction, month: string): boolean {
  return t.date.startsWith(month);
}

export function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${y}年${m}月`;
}

export function shortMonthLabel(month: string): string {
  const [, m] = month.split("-").map(Number);
  return `${m}月`;
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const wonFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

export function formatWon(amount: number): string {
  return wonFormatter.format(amount || 0);
}

export function formatYen(amount: number): string {
  return yenFormatter.format(amount || 0);
}

export function formatFxRate(rate: number): string {
  return `¥${rate.toFixed(4)}`;
}

export function sumByCategory(
  transactions: Transaction[],
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const t of transactions) {
    result[t.categoryId] = (result[t.categoryId] ?? 0) + t.amount;
  }
  return result;
}
