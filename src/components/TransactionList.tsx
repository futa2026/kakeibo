import { useMemo, useState } from "react";
import { ALL_CATEGORIES, categoryOrder, getCategory } from "../constants";
import { useKakeiboStore } from "../store";
import type { FxRate, Transaction, TransactionType } from "../types";
import { formatDateSlash, formatWon, formatYen, truncateChars } from "../utils";

interface Props {
  transactions: Transaction[];
  fx: FxRate | null;
}

type SortField = "date" | "category" | "amount";
type SortDir = "asc" | "desc";
type TypeFilter = "all" | TransactionType;

const inputStyle = {
  borderColor: "var(--rule)",
  background: "var(--paper-card)",
  color: "var(--ink)",
};

export function TransactionList({ transactions, fx }: Props) {
  const deleteTransaction = useKakeiboStore((s) => s.deleteTransaction);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "amount" ? "desc" : field === "date" ? "desc" : "asc");
    }
  }

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (categoryFilter !== "all" && t.categoryId !== categoryFilter) return false;
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;
      return true;
    });
  }, [transactions, typeFilter, categoryFilter, dateFrom, dateTo]);

  const dir = sortDir === "asc" ? 1 : -1;
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortField === "category") {
        const diff = categoryOrder(a.categoryId) - categoryOrder(b.categoryId);
        if (diff !== 0) return diff * dir;
      } else if (sortField === "amount") {
        const diff = a.amount - b.amount;
        if (diff !== 0) return diff * dir;
      }
      return a.date < b.date ? dir : a.date > b.date ? -dir : 0;
    });
  }, [filtered, sortField, dir]);

  const hasFilter =
    typeFilter !== "all" || categoryFilter !== "all" || dateFrom !== "" || dateTo !== "";

  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
        この月の記録はまだありません
      </p>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span style={{ color: "var(--ink-soft)" }}>並び替え:</span>
        {(
          [
            { field: "date", label: "日付" },
            { field: "category", label: "カテゴリ" },
            { field: "amount", label: "金額" },
          ] as const
        ).map(({ field, label }) => (
          <button
            key={field}
            type="button"
            onClick={() => toggleSort(field)}
            className="rounded px-2 py-1"
            style={{
              color: sortField === field ? "var(--ink)" : "var(--ink-soft)",
              background: sortField === field ? "var(--paper-card)" : "transparent",
              border: `1px solid ${sortField === field ? "var(--rule)" : "transparent"}`,
            }}
          >
            {label}
            {sortField === field && (sortDir === "asc" ? " ↑" : " ↓")}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span style={{ color: "var(--ink-soft)" }}>絞り込み:</span>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          className="rounded border px-2 py-1"
          style={inputStyle}
        >
          <option value="all">すべて</option>
          <option value="expense">支出</option>
          <option value="income">収入</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded border px-2 py-1"
          style={inputStyle}
        >
          <option value="all">全カテゴリ</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded border px-2 py-1"
          style={inputStyle}
        />
        <span style={{ color: "var(--ink-soft)" }}>〜</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded border px-2 py-1"
          style={inputStyle}
        />
        {hasFilter && (
          <button
            type="button"
            onClick={() => {
              setTypeFilter("all");
              setCategoryFilter("all");
              setDateFrom("");
              setDateTo("");
            }}
            className="underline underline-offset-2"
            style={{ color: "var(--series-1)" }}
          >
            クリア
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
          条件に一致する記録がありません
        </p>
      ) : (
        <ul className="divide-y" style={{ borderColor: "var(--rule)" }}>
          {sorted.map((t) => {
            const category = getCategory(t.categoryId);
            return (
              <li
                key={t.id}
                className="flex items-center gap-3 py-2.5"
                style={{ borderColor: "var(--rule)" }}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: category?.color ?? "var(--ink-soft)" }}
                  aria-hidden
                />
                <span
                  className="w-24 shrink-0 text-xs tabular-nums"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {formatDateSlash(t.date)}
                </span>
                <span
                  className="w-28 shrink-0 truncate text-xs"
                  style={{ color: "var(--ink)" }}
                  title={category?.label}
                >
                  {truncateChars(category?.label ?? "-", 18)}
                </span>
                <span className="flex-1 truncate text-xs" style={{ color: "var(--ink-soft)" }}>
                  {t.memo}
                </span>
                <span className="shrink-0 text-right">
                  <div
                    className="text-sm font-medium tabular-nums"
                    style={{
                      color: t.type === "expense" ? "var(--status-critical)" : "var(--series-1)",
                    }}
                  >
                    {t.type === "expense" ? "-" : "+"}
                    {formatWon(t.amount)}
                  </div>
                  {fx && (
                    <div className="text-xs tabular-nums" style={{ color: "var(--ink-soft)" }}>
                      {formatYen(t.amount * fx.rate)}
                    </div>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTransaction(t.id)}
                  className="shrink-0 rounded px-1.5 py-0.5 text-xs hover:bg-black/5 dark:hover:bg-white/10"
                  style={{ color: "var(--ink-soft)" }}
                  aria-label="削除"
                >
                  削除
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
