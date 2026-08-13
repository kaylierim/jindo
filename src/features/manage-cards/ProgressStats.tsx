import { Fragment, useMemo } from "react";
import {
  getProgressState,
  type ProgressState,
  type ReviewDirection,
} from "../../domain/card";
import type { CardRepository } from "../../data/cardRepository";

interface ProgressStatsProps {
  repository: CardRepository;
  refreshToken: number;
}

interface StatsRow {
  label: string;
  state: ProgressState;
}

const ROWS: StatsRow[] = [
  { label: "New", state: "new" },
  { label: "Learning", state: "learning" },
  { label: "Review", state: "review" },
];

type Counts = Record<ProgressState, Record<ReviewDirection, number>>;

function computeCounts(repository: CardRepository): Counts {
  const counts: Counts = {
    new: { recognition: 0, production: 0 },
    learning: { recognition: 0, production: 0 },
    review: { recognition: 0, production: 0 },
  };
  for (const reviewable of repository.getAllReviewables()) {
    const state = getProgressState(reviewable);
    counts[state][reviewable.direction] += 1;
  }
  return counts;
}

export function ProgressStats({ repository, refreshToken }: ProgressStatsProps) {
  // Pure derivations of repository + refreshToken — computed directly during
  // render rather than mirrored into state, so there's nothing to remount or
  // synchronize. `refreshToken` isn't read in either body, but it must stay in
  // the deps array: `repository`'s reference never changes even though its
  // underlying data does, so `refreshToken` is the only signal that tells these
  // memos to recompute after a card is added/edited/deleted.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshToken is a deliberate cache-bust signal, not an unused dep
  const totalCards = useMemo(() => repository.getAllCards().length, [repository, refreshToken]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshToken is a deliberate cache-bust signal, not an unused dep
  const counts = useMemo(() => computeCounts(repository), [repository, refreshToken]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-jindo-blue/20 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-jindo-charcoal">Your progress</p>
        <p className="text-sm font-medium text-jindo-charcoal">
          {totalCards} cards
        </p>
      </div>
      <div className="grid grid-cols-[1fr_3.5rem_3.5rem] gap-y-1 gap-x-5 text-sm">
        <span />
        <span className="text-right text-xs text-jindo-charcoal/60">
          Recognition
        </span>
        <span className="text-right text-xs text-jindo-charcoal/60">
          Production
        </span>
        {ROWS.map((row) => (
          <Fragment key={row.state}>
            <span className="text-jindo-charcoal/70">{row.label}</span>
            <span className="text-right text-jindo-charcoal">
              {counts[row.state].recognition}
            </span>
            <span className="text-right text-jindo-charcoal">
              {counts[row.state].production}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
