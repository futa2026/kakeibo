import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FxRate } from "../types";
import { formatWon, formatYen } from "../utils";

export interface TrendDatum {
  month: string;
  monthLabel: string;
  income: number;
  expense: number;
}

interface Props {
  data: TrendDatum[];
  fx: FxRate | null;
}

const SERIES_LABEL: Record<string, string> = { income: "収入", expense: "支出" };
const SERIES_COLOR: Record<string, string> = {
  income: "var(--series-1)",
  expense: "var(--status-critical)",
};

function CustomTooltip({
  active,
  payload,
  label,
  fx,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number }[];
  label?: string;
  fx: FxRate | null;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-md border px-3 py-2 text-xs shadow-sm"
      style={{
        background: "var(--chart-surface)",
        borderColor: "var(--chart-border)",
        color: "var(--chart-text-primary)",
      }}
    >
      <div className="mb-1 font-medium" style={{ color: "var(--chart-text-secondary)" }}>
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: SERIES_COLOR[p.dataKey] }}
            aria-hidden
          />
          <span style={{ color: "var(--chart-text-secondary)" }}>{SERIES_LABEL[p.dataKey]}</span>
          <span className="ml-auto tabular-nums font-medium">{formatWon(p.value)}</span>
          {fx && (
            <span className="tabular-nums" style={{ color: "var(--chart-text-muted)" }}>
              ({formatYen(p.value * fx.rate)})
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function TrendChart({ data, fx }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }} barGap={2}>
        <CartesianGrid vertical={false} stroke="var(--chart-gridline)" strokeDasharray="0" />
        <XAxis
          dataKey="monthLabel"
          tick={{ fill: "var(--chart-text-muted)", fontSize: 11 }}
          axisLine={{ stroke: "var(--chart-baseline)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--chart-text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={72}
          tickFormatter={(v: number) => formatWon(v)}
        />
        <Tooltip content={<CustomTooltip fx={fx} />} cursor={{ fill: "var(--chart-gridline)", opacity: 0.4 }} />
        <Legend
          formatter={(value: string) => (
            <span style={{ color: "var(--chart-text-secondary)", fontSize: 12 }}>
              {SERIES_LABEL[value] ?? value}
            </span>
          )}
        />
        <Bar dataKey="income" fill="var(--series-1)" radius={[4, 4, 0, 0]} maxBarSize={20} isAnimationActive={false} />
        <Bar dataKey="expense" fill="var(--status-critical)" radius={[4, 4, 0, 0]} maxBarSize={20} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
