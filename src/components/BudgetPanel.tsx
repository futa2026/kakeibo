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

  return (
    <div className="space-y-3">
      {EXPENSE_CATEGORIES.map((category) => {
        const budget = budgets[category.id] ?? 0;
        const spent = spentByCategory[category.id] ?? 0;
        const ratio = budget > 0 ? spent / budget : 0;
        const status = budget > 0 ? statusFor(ratio) : null;
        const fillPct = Math.min(ratio, 1) * 100;

        return (
          <div
            key={category.id}
            className="rounded-xl border p-3"
            style={{ borderColor: "var(--rule)", background: "var(--paper-card)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: category.color }}
                  aria-hidden
                />
                <span className="text-sm font-medium">{category.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  予算(₩)
                </span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={budget || ""}
                  placeholder="未設定"
                  onChange={(e) => setBudget(category.id, Number(e.target.value) || 0)}
                  className="w-28 rounded-md border px-2 py-1 text-right text-xs tabular-nums outline-none"
                  style={{
                    borderColor: "var(--rule)",
                    background: "var(--paper)",
                    color: "var(--ink)",
                  }}
                />
              </div>
            </div>

            {budget > 0 ? (
              <div className="mt-2">
                <div
                  className="h-2 w-full overflow-hidden rounded-full"
                  style={{ background: "var(--rule)" }}
                >
                  <div
                    className="h-full rounded-full transition-[width]"
                    style={{ width: `${fillPct}%`, background: status!.color }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span
                    className="flex items-center gap-1 font-medium"
                    style={{ color: status!.color }}
                  >
                    <span aria-hidden>{status!.icon}</span>
                    {status!.label}
                  </span>
                  <span className="text-right tabular-nums" style={{ color: "var(--ink-soft)" }}>
                    <div>
                      {formatWon(spent)} / {formatWon(budget)} ({Math.round(ratio * 100)}%)
                    </div>
                    {fx && (
                      <div>
                        {formatYen(spent * fx.rate)} / {formatYen(budget * fx.rate)}
                      </div>
                    )}
                  </span>
                </div>
              </div>
            ) : (
              spent > 0 && (
                <p className="mt-2 text-xs tabular-nums" style={{ color: "var(--ink-soft)" }}>
                  今月の支出: {formatWon(spent)}
                  {fx && `(${formatYen(spent * fx.rate)})`}
                </p>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
