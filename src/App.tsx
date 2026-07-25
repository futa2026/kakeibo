import { useEffect, useMemo, useState } from "react";
import { BudgetPanel } from "./components/BudgetPanel";
import { CategoryBarChart } from "./components/CategoryBarChart";
import { FxBar } from "./components/FxBar";
import { HankoStamp } from "./components/HankoStamp";
import { MonthPicker } from "./components/MonthPicker";
import { SummaryTiles } from "./components/SummaryTiles";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { TrendChart, type TrendDatum } from "./components/TrendChart";
import { fetchKrwToJpyRate } from "./fx";
import { useKakeiboStore } from "./store";
import {
  currentMonth,
  inMonth,
  shiftMonth,
  shortMonthLabel,
  sumByCategory,
} from "./utils";

const TABS = [
  { id: "record", label: "記録(기록)" },
  { id: "summary", label: "集計(집계)" },
  { id: "budget", label: "予算(예산)" },
] as const;

type Tab = (typeof TABS)[number]["id"];

function App() {
  const transactions = useKakeiboStore((s) => s.transactions);
  const budgets = useKakeiboStore((s) => s.budgets);
  const fx = useKakeiboStore((s) => s.fx);
  const setFx = useKakeiboStore((s) => s.setFx);

  const [month, setMonth] = useState(currentMonth());
  const [tab, setTab] = useState<Tab>("record");
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState(false);

  async function refreshRate() {
    setRateLoading(true);
    setRateError(false);
    try {
      setFx(await fetchKrwToJpyRate());
    } catch {
      setRateError(true);
    } finally {
      setRateLoading(false);
    }
  }

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (!fx || fx.date !== today) {
      refreshRate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthly = useMemo(
    () => transactions.filter((t) => inMonth(t, month)),
    [transactions, month],
  );

  const income = useMemo(
    () => monthly.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    [monthly],
  );
  const expense = useMemo(
    () => monthly.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    [monthly],
  );

  const expenseByCategory = useMemo(
    () => sumByCategory(monthly.filter((t) => t.type === "expense")),
    [monthly],
  );

  const chartData = useMemo(
    () => Object.entries(expenseByCategory).map(([categoryId, amount]) => ({ categoryId, amount })),
    [expenseByCategory],
  );

  const trendData: TrendDatum[] = useMemo(() => {
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) months.push(shiftMonth(month, -i));
    return months.map((mk) => {
      const tx = transactions.filter((t) => inMonth(t, mk));
      return {
        month: mk,
        monthLabel: shortMonthLabel(mk),
        income: tx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
        expense: tx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions, month]);

  const totalBudget = useMemo(
    () => Object.values(budgets).reduce((s, v) => s + (Number(v) || 0), 0),
    [budgets],
  );
  const budgetRatio = totalBudget > 0 ? expense / totalBudget : null;
  const stamp = useMemo(() => {
    if (budgetRatio === null) return { text: "未設定(설정되지 않음)", color: "var(--ink-soft)" };
    if (budgetRatio > 1) return { text: "超過(초과)", color: "var(--status-critical)" };
    if (budgetRatio >= 0.8) return { text: "要注意(주의 필요)", color: "var(--status-warning)" };
    return { text: "順調(순조로움)", color: "var(--series-1)" };
  }, [budgetRatio]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <header className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-xs tracking-[0.3em]" style={{ color: "var(--ink-soft)" }}>
            KAKEIBO LEDGER
          </div>
          <h1 className="mt-1 text-3xl font-bold font-ledger">家計簿(가계부)</h1>
        </div>
        <HankoStamp text={stamp.text} color={stamp.color} />
      </header>

      <div className="mb-5">
        <FxBar fx={fx} loading={rateLoading} error={rateError} onRefresh={refreshRate} />
      </div>

      <div className="mb-5 overflow-x-auto">
        <MonthPicker month={month} onChange={setMonth} />
      </div>

      <SummaryTiles income={income} expense={expense} fx={fx} />

      <nav className="mt-6 mb-4 flex gap-1 border-b" style={{ borderColor: "var(--rule)" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="px-3 py-2 text-sm font-medium"
            style={{
              color: tab === t.id ? "var(--ink)" : "var(--ink-soft)",
              borderBottom: tab === t.id ? "2px solid var(--series-1)" : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "record" && (
        <div className="space-y-4">
          <TransactionForm />
          <TransactionList transactions={monthly} fx={fx} />
        </div>
      )}

      {tab === "summary" && (
        <div className="space-y-6">
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--rule)", background: "var(--paper-card)" }}
          >
            <h2 className="mb-3 text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
              カテゴリ別支出(카테고리별 지출)
            </h2>
            <CategoryBarChart data={chartData} fx={fx} />
          </div>
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--rule)", background: "var(--paper-card)" }}
          >
            <h2 className="mb-3 text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
              直近6ヶ月推移(최근 6개월 추이)
            </h2>
            <TrendChart data={trendData} fx={fx} />
          </div>
        </div>
      )}

      {tab === "budget" && <BudgetPanel spentByCategory={expenseByCategory} fx={fx} />}
    </div>
  );
}

export default App;
