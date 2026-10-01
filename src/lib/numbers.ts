export type Place = "units" | "tens" | "hundreds" | "sep";
export type Glyph = { ch: string; place: Place };
export type CompareSymbol = "<" | "=" | ">";
export type SortDir = "asc" | "desc";

export function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function randomDigitCount(maxDigits: number): number {
  if (maxDigits <= 1) return 1;
  if (Math.random() < 0.55) return maxDigits;
  return randomInt(1, maxDigits);
}

export function randomNumber(maxDigits: number): number {
  const digits = randomDigitCount(clampDigits(maxDigits));
  if (digits === 1) return randomInt(0, 9);
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return randomInt(min, max);
}

export function clampDigits(n: number): number {
  return Math.min(9, Math.max(1, Math.round(n)));
}

export function formatGrouped(n: number): string {
  const sign = n < 0 ? "-" : "";
  const s = Math.abs(n).toString();
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.slice(Math.max(0, i - 3), i));
  }
  return sign + parts.join(".");
}

export function numberGlyphs(n: number): Glyph[] {
  const formatted = formatGrouped(n);
  const glyphs: Glyph[] = [];
  let digitFromRight = 0;
  for (let i = formatted.length - 1; i >= 0; i--) {
    const ch = formatted[i]!;
    if (ch === "." || ch === "-") {
      glyphs.push({ ch, place: "sep" });
    } else {
      const p = digitFromRight % 3;
      glyphs.push({
        ch,
        place: p === 0 ? "units" : p === 1 ? "tens" : "hundreds",
      });
      digitFromRight += 1;
    }
  }
  return glyphs.reverse();
}

export function spokenNumber(n: number): string {
  return formatGrouped(n).replaceAll(".", " ");
}

export function compareSymbol(a: number, b: number): CompareSymbol {
  if (a < b) return "<";
  if (a > b) return ">";
  return "=";
}

export function generateComparePair(maxDigits: number): [number, number] {
  const a = randomNumber(maxDigits);
  if (Math.random() < 0.12) return [a, a];
  let b = randomNumber(maxDigits);
  let guard = 0;
  while (b === a && guard++ < 24) b = randomNumber(maxDigits);
  return [a, b];
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

export function isSorted(arr: readonly number[], dir: SortDir): boolean {
  for (let i = 1; i < arr.length; i++) {
    const prev = arr[i - 1]!;
    const cur = arr[i]!;
    if (dir === "asc" && cur < prev) return false;
    if (dir === "desc" && cur > prev) return false;
  }
  return true;
}

export function sortNumbers(arr: readonly number[], dir: SortDir): number[] {
  return [...arr].sort((a, b) => (dir === "asc" ? a - b : b - a));
}

export function swapAt<T>(arr: readonly T[], i: number, j: number): T[] {
  const next = [...arr];
  const a = next[i];
  const b = next[j];
  if (a === undefined || b === undefined) return next;
  next[i] = b;
  next[j] = a;
  return next;
}

export function generateSortValues(count: number, maxDigits: number): number[] {
  const size = Math.min(8, Math.max(3, Math.round(count)));
  const digits = clampDigits(maxDigits);
  const pool = new Set<number>();
  let guard = 0;
  while (pool.size < size && guard++ < 8000) {
    pool.add(randomNumber(digits));
  }
  let n = 0;
  while (pool.size < size) {
    pool.add(n);
    n += 1;
  }
  const values = shuffleInPlace([...pool]);
  if (isSorted(values, "asc") || isSorted(values, "desc")) {
    const first = values.shift();
    if (first !== undefined) values.push(first);
  }
  return values;
}
