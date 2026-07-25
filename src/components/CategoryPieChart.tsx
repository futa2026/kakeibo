import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getCategory } from "../constants";
import type { FxRate } from "../types";
import { formatWon, formatYen } from "../utils";

interface Datum {
  categoryId: string;
  label: string;
  amount: number;
  color: string;
}

interface Props {
  data: { categoryId: string; amount: number }[];
  fx: FxRate | null;
}

function CustomTooltip({
  active,
  payload,
  fx,
}: {
  active?: boolean;
  payload?: { payload: Datum }[];
  fx: FxRate | null;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-md border px-3 py-2 text-xs shadow-sm"
      style={{
        background: "var(--chart-surface)",
        borderColor: "var(--chart-border)",
        color: "var(--chart-text-primary)",
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: d.color }} aria-hidden />
        <span style={{ color: "var(--chart-text-secondary)" }}>{d.label}</span>
      </div>
      <div className="mt-0.5 font-medium tabular-nums">{formatWon(d.amount)}</div>
      {fx && (
        <div className="tabular-nums" style={{ color: "var(--chart-text-muted)" }}>
          {formatYen(d.amount * fx.rate)}
        </div>
      )}
    </div>
  );
}

export function CategoryPieChart({ data, fx }: Props) {
  const chartData: Datum[] = data
    .map((d) => {
      const category = getCategory(d.categoryId);
      return {
        categoryId: d.categoryId,
        label: category?.label ?? d.categoryId,
        amount: d.amount,
        color: category?.color ?? "var(--series-8)",
      };
    })
    .sort((a, b) => b.amount - a.amount);

  if (chartData.length === 0) {
    return (
      <p className="py-8 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
        この月の支出データがありません
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="amount"
          nameKey="label"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          isAnimationActive={false}
        >
          {chartData.map((entry) => (
            <Cell key={entry.categoryId} fill={entry.color} stroke="var(--chart-surface)" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip fx={fx} />} />
        <Legend
          formatter={(value: string) => (
            <span style={{ color: "var(--chart-text-secondary)", fontSize: 12 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
