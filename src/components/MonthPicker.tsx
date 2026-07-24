import { useMemo } from "react";
import { currentMonth, monthLabel, shiftMonth, shortMonthLabel } from "../utils";

interface Props {
  month: string;
  onChange: (month: string) => void;
}

export function MonthPicker({ month, onChange }: Props) {
  const quickMonths = useMemo(() => {
    const base = currentMonth();
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) months.push(shiftMonth(base, -i));
    return months;
  }, []);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, -1))}
        className="h-8 w-8 shrink-0 rounded-md border text-sm hover:bg-black/5 dark:hover:bg-white/10"
        style={{ borderColor: "var(--rule)", color: "var(--ink-soft)" }}
        aria-label="前月"
      >
        ‹
      </button>
      <span className="min-w-[7ch] shrink-0 text-center text-sm font-medium tabular-nums font-ledger">
        {monthLabel(month)}
      </span>
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, 1))}
        className="h-8 w-8 shrink-0 rounded-md border text-sm hover:bg-black/5 dark:hover:bg-white/10"
        style={{ borderColor: "var(--rule)", color: "var(--ink-soft)" }}
        aria-label="翌月"
      >
        ›
      </button>
      <div className="ml-1 flex gap-1 overflow-x-auto">
        {quickMonths.map((mk) => (
          <button
            key={mk}
            type="button"
            onClick={() => onChange(mk)}
            className="shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs"
            style={
              mk === month
                ? { background: "var(--series-1)", borderColor: "var(--series-1)", color: "#fff" }
                : { borderColor: "var(--rule)", color: "var(--ink-soft)" }
            }
          >
            {shortMonthLabel(mk)}
          </button>
        ))}
      </div>
    </div>
  );
}
