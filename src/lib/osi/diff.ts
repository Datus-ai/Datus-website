// A tiny line-based diff (LCS) so the Playground's Diff tab works without the
// `diff` npm package. Returns parts compatible with what the UI renders:
// `{ value, added?, removed? }`, where `value` is a chunk of one-or-more lines
// joined by "\n". Contiguous lines of the same kind are grouped into one part.

export type DiffPart = { value: string; added?: boolean; removed?: boolean };

/** Diff two strings line by line. */
export function diffLines(a: string, b: string): DiffPart[] {
  const aLines = splitLines(a);
  const bLines = splitLines(b);

  // Longest common subsequence table over lines.
  const n = aLines.length;
  const m = bLines.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = aLines[i] === bLines[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const parts: DiffPart[] = [];
  const push = (line: string, kind: "same" | "add" | "rm") => {
    const last = parts[parts.length - 1];
    const added = kind === "add" || undefined;
    const removed = kind === "rm" || undefined;
    if (last && !!last.added === !!added && !!last.removed === !!removed) {
      last.value += line;
    } else {
      parts.push({ value: line, added, removed });
    }
  };

  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (aLines[i] === bLines[j]) {
      push(aLines[i], "same");
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push(aLines[i], "rm");
      i++;
    } else {
      push(bLines[j], "add");
      j++;
    }
  }
  while (i < n) push(aLines[i++], "rm");
  while (j < m) push(bLines[j++], "add");

  return parts;
}

/** Split into lines while keeping the trailing "\n" on each line. */
function splitLines(s: string): string[] {
  if (s === "") return [];
  const out = s.match(/[^\n]*\n|[^\n]+/g) ?? [];
  return out;
}
