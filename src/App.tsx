import { useEffect, useMemo, useState } from "react";
import { BudgetPanel } from "./components/BudgetPanel";
import { CategoryPieChart } from "./components/CategoryPieChart";
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
  localDateString,
  monthLabel,
  shiftMonth,
  shortMonthLabel,
  sumByCategory,
} from "./utils";

function App() {
  const transactions = useKakeiboStore((s) => s.transactions);
  const budgets = useKakeiboStore((s) => s.budgets);
  const fx = useKakeiboStore((s) => s.fx);
  const fxFetchedAt = useKakeiboStore((s) => s.fxFetchedAt);
  const setFx = useKakeiboStore((s) => s.setFx);

  const [month, setMonth] = useState(currentMonth());
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
    const today = localDateString();
    if (!fx || fxFetchedAt !== today) {
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
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-10 md:py-10">
      <header className="flex items-start justify-between">
        <div>
          <div className="text-xs tracking-[0.3em]" style={{ color: "var(--ink-soft)" }}>
            KAKEIBO LEDGER
          </div>
          <h1 className="mt-1 text-3xl font-bold font-ledger">家計簿(가계부)</h1>
        </div>
        <HankoStamp text={stamp.text} color={stamp.color} />
      </header>

      <div className="fold-rule my-5" />

      <div className="mb-5">
        <FxBar fx={fx} loading={rateLoading} error={rateError} onRefresh={refreshRate} />
      </div>

      <div className="mb-5 overflow-x-auto">
        <MonthPicker month={month} onChange={setMonth} />
      </div>

      <div className="mb-6">
        <SummaryTiles income={income} expense={expense} fx={fx} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="section-title mb-3">予算の進み具合(예산 진행 상황)</h2>
          <BudgetPanel spentByCategory={expenseByCategory} fx={fx} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="card">
            <h2 className="section-title mb-3">記録を追加(기록 추가)</h2>
            <TransactionForm />
          </div>

          <div className="card">
            <h2 className="section-title mb-3">カテゴリ別支出(카테고리별 지출)</h2>
            <CategoryPieChart data={chartData} fx={fx} />
          </div>

          <div className="card">
            <h2 className="section-title mb-3">直近6ヶ月推移(최근 6개월 추이)</h2>
            <TrendChart data={trendData} fx={fx} />
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="section-title mb-3">{monthLabel(month)}の記録(의 기록)</h2>
        <TransactionList transactions={monthly} fx={fx} />
      </div>
    </div>
  );
}

export default App;
