import type { FxRate } from "../types";
import { formatWon, formatYen } from "../utils";

interface Props {
  income: number;
  expense: number;
  fx: FxRate | null;
}

export function SummaryTiles({ income, expense, fx }: Props) {
  const balance = income - expense;
  const tiles = [
    { label: "収入(수입)", value: income, tone: "var(--series-1)" },
    { label: "支出(지출)", value: expense, tone: "var(--status-critical)" },
    {
      label: "残高(잔액)",
      value: balance,
      tone: balance >= 0 ? "var(--ink)" : "var(--status-critical)",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="card"
          style={{ borderTopWidth: "3px", borderTopColor: tile.tone }}
        >
          <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
            {tile.label}
          </div>
          <div
            className="mt-1 text-lg font-semibold tabular-nums sm:text-2xl font-ledger"
            style={{ color: tile.tone }}
          >
            {formatWon(tile.value)}
          </div>
          {fx && (
            <div className="mt-0.5 text-xs tabular-nums" style={{ color: "var(--ink-soft)" }}>
              {formatYen(tile.value * fx.rate)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
