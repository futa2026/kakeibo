import { getCategory } from "../constants";
import { useKakeiboStore } from "../store";
import type { FxRate, Transaction } from "../types";
import { formatWon, formatYen } from "../utils";

interface Props {
  transactions: Transaction[];
  fx: FxRate | null;
}

export function TransactionList({ transactions, fx }: Props) {
  const deleteTransaction = useKakeiboStore((s) => s.deleteTransaction);

  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
        この月の記録はまだありません
      </p>
    );
  }

  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
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
              className="w-20 shrink-0 text-xs tabular-nums"
              style={{ color: "var(--ink-soft)" }}
            >
              {t.date.slice(5)}
            </span>
            <span className="w-16 shrink-0 text-xs" style={{ color: "var(--ink)" }}>
              {category?.label ?? "-"}
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
  );
}
