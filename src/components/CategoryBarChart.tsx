import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: d.color }}
          aria-hidden
        />
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

export function CategoryBarChart({ data, fx }: Props) {
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

  const height = Math.max(chartData.length * 40, 120);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 64, left: 8, bottom: 4 }}
        barCategoryGap={2}
      >
        <CartesianGrid
          horizontal={false}
          stroke="var(--chart-gridline)"
          strokeDasharray="0"
        />
        <XAxis
          type="number"
          tick={{ fill: "var(--chart-text-muted)", fontSize: 11 }}
          tickFormatter={(v: number) => formatWon(v)}
          axisLine={{ stroke: "var(--chart-baseline)" }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fill: "var(--chart-text-secondary)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={64}
        />
        <Tooltip
          content={<CustomTooltip fx={fx} />}
          cursor={{ fill: "var(--chart-gridline)", opacity: 0.4 }}
        />
        <Bar dataKey="amount" radius={[0, 4, 4, 0]} maxBarSize={24} isAnimationActive={false}>
          {chartData.map((entry) => (
            <Cell key={entry.categoryId} fill={entry.color} />
          ))}
          <LabelList
            dataKey="amount"
            position="right"
            formatter={(v: unknown) => (v == null ? "" : formatWon(Number(v)))}
            style={{ fill: "var(--chart-text-primary)", fontSize: 12, fontWeight: 500 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
