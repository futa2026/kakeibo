import type { FxRate } from "./types";

export async function fetchKrwToJpyRate(): Promise<FxRate> {
  const res = await fetch(
    "https://api.frankfurter.dev/v1/latest?base=KRW&symbols=JPY",
  );
  if (!res.ok) throw new Error(`fx fetch failed: ${res.status}`);
  const data = await res.json();
  const rate = data?.rates?.JPY;
  if (typeof rate !== "number" || !(rate > 0)) {
    throw new Error("invalid fx response");
  }
  return { rate, date: data.date ?? new Date().toISOString().slice(0, 10) };
}
