import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Budgets, FxRate, Transaction } from "./types";

interface KakeiboState {
  transactions: Transaction[];
  budgets: Budgets;
  fx: FxRate | null;
  fxFetchedAt: string | null;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (categoryId: string, amount: number) => void;
  setFx: (fx: FxRate) => void;
}

export const useKakeiboStore = create<KakeiboState>()(
  persist(
    (set) => ({
      transactions: [],
      budgets: {},
      fx: null,
      fxFetchedAt: null,
      addTransaction: (t) =>
        set((state) => ({
          transactions: [
            { ...t, id: crypto.randomUUID() },
            ...state.transactions,
          ],
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      setBudget: (categoryId, amount) =>
        set((state) => ({
          budgets: { ...state.budgets, [categoryId]: amount },
        })),
      setFx: (fx) =>
        set({ fx, fxFetchedAt: new Date().toISOString().slice(0, 10) }),
    }),
    { name: "kakeibo-storage" },
  ),
);
