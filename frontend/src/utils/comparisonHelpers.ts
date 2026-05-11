type MaybeNumber = number | null;

export function pickComparisonWinner(values: MaybeNumber[], higherIsBetter: boolean): number | null {
  const defined = values
    .map((v, i) => ({ v, i }))
    .filter((x): x is { v: number; i: number } => x.v !== null);

  if (defined.length < 2) return null;

  const best = defined.reduce((a, b) =>
    higherIsBetter ? (a.v >= b.v ? a : b) : (a.v <= b.v ? a : b)
  );

  const tiedCount = defined.filter(x => x.v === best.v).length;
  if (tiedCount > 1) return null;

  return best.i;
}

export function getWorstIndex(values: MaybeNumber[], higherIsBetter: boolean): number | null {
  const defined = values
    .map((v, i) => ({ v, i }))
    .filter((x): x is { v: number; i: number } => x.v !== null);

  if (defined.length < 2) return null;

  const worst = defined.reduce((a, b) =>
    higherIsBetter ? (a.v <= b.v ? a : b) : (a.v >= b.v ? a : b)
  );

  const tiedCount = defined.filter(x => x.v === worst.v).length;
  if (tiedCount > 1) return null;

  return worst.i;
}
