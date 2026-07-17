// A tiny line-based diff (LCS) so the Playground's Diff tab works without the
// `diff` npm package. Returns parts compatible with what the UI renders:
// `{ value, added?, removed? }`, where `value` is a chunk of one-or-more lines
// joined by "\n". Contiguous lines of the same kind are grouped into one part.
//
// The full LCS table is O(n·m) memory, which is dangerous for large inputs
// (a ~150KB YAML can be ~5k lines → ~25M cells → ~200MB, on the main thread).
// We keep it bounded two ways: trim the common prefix/suffix first (cheap and
// usually huge), then only run the DP when the remaining middle is small
// enough; past that cap we degrade to a plain removed-block/added-block diff so
// memory and time stay flat.

export type DiffPart = { value: string; added?: boolean; removed?: boolean };

// Max DP cells we are willing to allocate (~1.5M ≈ 12MB of doubles, <30ms).
const MAX_CELLS = 1_500_000;

/** Diff two strings line by line. */
export function diffLines(a: string, b: string): DiffPart[] {
  const aLines = splitLines(a);
  const bLines = splitLines(b);

  const builder = new PartBuilder();

  // 1. Common prefix — identical leading lines pass through untouched.
  let lo = 0;
  const minLen = Math.min(aLines.length, bLines.length);
  while (lo < minLen && aLines[lo] === bLines[lo]) {
    builder.push(aLines[lo], "same");
    lo++;
  }

  // 2. Common suffix — identical trailing lines (not overlapping the prefix).
  let aHi = aLines.length;
  let bHi = bLines.length;
  while (aHi > lo && bHi > lo && aLines[aHi - 1] === bLines[bHi - 1]) {
    aHi--;
    bHi--;
  }

  // 3. Diff the differing middle.
  const aMid = aLines.slice(lo, aHi);
  const bMid = bLines.slice(lo, bHi);
  if (aMid.length * bMid.length > MAX_CELLS) {
    // Degrade: emit removals then additions. Bounded memory, still readable.
    for (const l of aMid) builder.push(l, "rm");
    for (const l of bMid) builder.push(l, "add");
  } else {
    lcsWalk(aMid, bMid, builder);
  }

  // 4. Common suffix.
  for (let i = aHi; i < aLines.length; i++) builder.push(aLines[i], "same");

  return builder.parts;
}

/** LCS walk over two (already prefix/suffix-trimmed) line arrays. */
function lcsWalk(a: string[], b: string[], builder: PartBuilder): void {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      builder.push(a[i], "same");
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      builder.push(a[i], "rm");
      i++;
    } else {
      builder.push(b[j], "add");
      j++;
    }
  }
  while (i < n) builder.push(a[i++], "rm");
  while (j < m) builder.push(b[j++], "add");
}

/** Accumulates lines into grouped {value, added?, removed?} parts. */
class PartBuilder {
  parts: DiffPart[] = [];
  push(line: string, kind: "same" | "add" | "rm"): void {
    const added = kind === "add" || undefined;
    const removed = kind === "rm" || undefined;
    const last = this.parts[this.parts.length - 1];
    if (last && !!last.added === !!added && !!last.removed === !!removed) {
      last.value += line;
    } else {
      this.parts.push({ value: line, added, removed });
    }
  }
}

/** Split into lines while keeping the trailing "\n" on each line. */
function splitLines(s: string): string[] {
  if (s === "") return [];
  return s.match(/[^\n]*\n|[^\n]+/g) ?? [];
}
