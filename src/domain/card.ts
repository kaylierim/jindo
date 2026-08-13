import { createEmptyCard, fsrs, State, type Card as FsrsState } from 'ts-fsrs'
import { Rating as Grade } from 'ts-fsrs'

export { Grade }

export type ReviewGrade = Exclude<Grade, Grade.Manual>

export type ReviewDirection = 'recognition' | 'production'

export interface VocabCard {
  id: string
  korean: string
  english: string
  example: string
  productionEnabled: boolean
}

export interface Reviewable {
  cardId: string
  direction: ReviewDirection
  fsrs: FsrsState
}

const scheduler = fsrs()

export function createCard(
  korean: string,
  english: string,
  example: string,
  productionEnabled = true,
): VocabCard {
  return {
    id: crypto.randomUUID(),
    korean,
    english,
    example,
    productionEnabled,
  }
}

export function createReviewable(cardId: string, direction: ReviewDirection, now: Date = new Date()): Reviewable {
  return {
    cardId,
    direction,
    fsrs: createEmptyCard(now),
  }
}

export function gradeReview(reviewable: Reviewable, grade: ReviewGrade, now: Date = new Date()): Reviewable {
  const { card: nextFsrsState } = scheduler.next(reviewable.fsrs, now, grade)
  return { ...reviewable, fsrs: nextFsrsState }
}

export function isDue(reviewable: Reviewable, now: Date = new Date()): boolean {
  return reviewable.fsrs.due <= now
}

export type ProgressState = 'new' | 'learning' | 'review'

export function getProgressState(reviewable: Reviewable): ProgressState {
  switch (reviewable.fsrs.state) {
    case State.New:
      return 'new'
    case State.Review:
      return 'review'
    case State.Learning:
    case State.Relearning:
      return 'learning'
  }
}

// 21 days matches the conventional "mature card" threshold used across
// spaced-repetition tools (e.g. Anki), so it's a well-understood benchmark
// rather than an app-specific guess.
export const MATURE_STABILITY_DAYS = 21

export function isMature(reviewable: Reviewable): boolean {
  return reviewable.fsrs.stability >= MATURE_STABILITY_DAYS
}
