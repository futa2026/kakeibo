import type { FxRate } from "../types";
import { formatFxRate } from "../utils";

interface Props {
  fx: FxRate | null;
  loading: boolean;
  error: boolean;
  onRefresh: () => void;
}

export function FxBar({ fx, loading, error, onRefresh }: Props) {
  return (
    <div
      className="flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs"
      style={{ borderColor: "var(--rule)", background: "var(--paper-card)", color: "var(--ink)" }}
    >
      <span
        className="fx-dot"
        style={{
          background: loading
            ? "var(--status-warning)"
            : fx
              ? "var(--series-1)"
              : "var(--status-critical)",
        }}
        aria-hidden
      />
      {loading ? (
        <span style={{ color: "var(--ink-soft)" }}>レートを取得中…</span>
      ) : fx ? (
        <span className="tabular-nums">
          1₩ = {formatFxRate(fx.rate)}(<span style={{ color: "var(--ink-soft)" }}>{fx.date} 時点</span>)
        </span>
      ) : (
        <span style={{ color: "var(--status-critical)" }}>
          {error ? "レートを取得できませんでした" : "レート未取得"}
        </span>
      )}
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="link-btn"
      >
        更新
      </button>
    </div>
  );
}
