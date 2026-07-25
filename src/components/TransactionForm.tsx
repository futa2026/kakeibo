import { useState } from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants";
import { useKakeiboStore } from "../store";
import type { TransactionType } from "../types";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionForm() {
  const addTransaction = useKakeiboStore((s) => s.addTransaction);
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState(today());
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(EXPENSE_CATEGORIES[0].id);
  const [memo, setMemo] = useState("");

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function handleTypeChange(next: TransactionType) {
    setType(next);
    setCategoryId(
      (next === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES)[0].id,
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) return;
    addTransaction({ type, date, amount: parsed, categoryId, memo });
    setAmount("");
    setMemo("");
  }

  const inputClass =
    "w-full rounded-md border-0 border-b px-0.5 py-2 text-sm outline-none bg-transparent";
  const inputStyle = {
    borderColor: "var(--rule)",
    color: "var(--ink)",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border p-4"
      style={{ borderColor: "var(--rule)", background: "var(--paper-card)" }}
    >
      <div className="mb-3 flex gap-2">
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeChange(t)}
            className="rounded-md px-3 py-1.5 text-sm font-medium border"
            style={{
              borderColor: type === t ? "transparent" : "var(--rule)",
              background:
                type === t
                  ? t === "expense"
                    ? "var(--status-critical)"
                    : "var(--series-1)"
                  : "transparent",
              color: type === t ? "#fff" : "var(--ink-soft)",
            }}
          >
            {t === "expense" ? "支出" : "収入"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="col-span-1">
          <label className="mb-1 block text-xs" style={{ color: "var(--ink-soft)" }}>
            日付(날짜)
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            style={inputStyle}
            required
          />
        </div>
        <div className="col-span-1">
          <label className="mb-1 block text-xs" style={{ color: "var(--ink-soft)" }}>
            ₩金額(금액)
          </label>
          <input
            type="text"
            inputMode="numeric"
            min="1"
            placeholder="₩0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${inputClass} tabular-nums`}
            style={inputStyle}
            required
          />
        </div>
        <div className="col-span-1">
          <label className="mb-1 block text-xs" style={{ color: "var(--ink-soft)" }}>
            カテゴリ(카테고리)
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
            style={inputStyle}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <label className="mb-1 block text-xs" style={{ color: "var(--ink-soft)" }}>
            メモ(메모)
          </label>
          <input
            type="text"
            placeholder="任意(선택 사항)"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <button
          type="submit"
          className="col-span-1 self-end rounded-md py-2 text-sm font-medium text-white"
          style={{ background: "var(--series-1)" }}
        >
          記録(기록)
        </button>
      </div>
    </form>
  );
}
