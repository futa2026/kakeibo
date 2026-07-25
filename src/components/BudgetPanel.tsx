import { useState } from "react";
import { EXPENSE_CATEGORIES } from "../constants";
import { useKakeiboStore } from "../store";
import type { FxRate } from "../types";
import { formatWon, formatYen } from "../utils";

interface Props {
  spentByCategory: Record<string, number>;
  fx: FxRate | null;
}

function statusFor(ratio: number): { color: string; label: string; icon: string } {
  if (ratio >= 1) return { color: "var(--status-critical)", label: "超過(초과)", icon: "⚠" };
  if (ratio >= 0.8) return { color: "var(--status-warning)", label: "要注意(주의)", icon: "!" };
  return { color: "var(--status-good)", label: "順調(양호)", icon: "✓" };
}

export function BudgetPanel({ spentByCategory, fx }: Props) {
  const budgets = useKakeiboStore((s) => s.budgets);
  const setBudget = useKakeiboStore((s) => s.setBudget);
  const [showSettings, setShowSettings] = useState(false);

  const activeBudgets = EXPENSE_CATEGORIES.filter((c) => (budgets[c.id] ?? 0) > 0);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
          カテゴリごとの月次上限(카테고리별 월 한도)
        </span>
        <button type="button" onClick={() => setShowSettings((s) => !s)} className="link-btn">
          {showSettings ? "閉じる" : "予算を設定"}
        </button>
      </div>

      {showSettings && (
        <div
          className="mb-4 grid grid-cols-2 gap-3 border-b pb-4 sm:grid-cols-3"
          style={{ borderColor: "var(--rule)" }}
        >
          {EXPENSE_CATEGORIES.map((category) => (
            <label key={category.id} className="flex flex-col gap-1 text-sm">
              <span style={{ color: "var(--ink-soft)" }}>{category.label}</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="₩0"
                value={budgets[category.id] || ""}
                onChange={(e) => setBudget(category.id, Number(e.target.value) || 0)}
                className="ledger-input"
              />
            </label>
          ))}
        </div>
      )}

      {activeBudgets.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
          まだ予算が設定されていません。上のボタンから月ごとの上限を入力してください。
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {activeBudgets.map((category) => {
            const budget = budgets[category.id];
            const spent = spentByCategory[category.id] ?? 0;
            const ratio = spent / budget;
            const status = statusFor(ratio);
            const fillPct = Math.min(ratio, 1) * 100;

            return (
              <div key={category.id}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: category.color }}
                      aria-hidden
                    />
                    {category.label}
                  </span>
                  <span className="text-right tabular-nums" style={{ color: "var(--ink-soft)" }}>
                    <div>
                      {formatWon(spent)} / {formatWon(budget)}
                    </div>
                    {fx && (
                      <div className="text-xs">
                        {formatYen(spent * fx.rate)} / {formatYen(budget * fx.rate)}
                      </div>
                    )}
                  </span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full"
                  style={{ background: "var(--rule)" }}
                >
                  <div
                    className="h-full rounded-full transition-[width]"
                    style={{ width: `${fillPct}%`, background: status.color }}
                  />
                </div>
                <div
                  className="mt-1 flex items-center gap-1 text-xs font-medium"
                  style={{ color: status.color }}
                >
                  <span aria-hidden>{status.icon}</span>
                  {status.label}({Math.round(ratio * 100)}%)
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
