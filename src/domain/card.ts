import { createEmptyCard, fsrs, type Card as FsrsState } from 'ts-fsrs'
import { Rating as Grade } from 'ts-fsrs'

export { Grade }

export interface VocabCard {
  id: string
  korean: string
  english: string
  example: string
}

export interface ScheduledCard extends VocabCard {
  fsrs: FsrsState
}

const scheduler = fsrs()

export function createCard(korean: string, english: string, example: string): ScheduledCard {
  return {
    id: crypto.randomUUID(),
    korean,
    english,
    example,
    fsrs: createEmptyCard(new Date()),
  }
}

export function gradeReview(card: ScheduledCard, grade: Exclude<Grade, Grade.Manual>, now: Date = new Date()): ScheduledCard {
  const { card: nextFsrsState } = scheduler.next(card.fsrs, now, grade)
  return { ...card, fsrs: nextFsrsState }
}

export function isDue(card: ScheduledCard, now: Date = new Date()): boolean {
  return card.fsrs.due <= now
}
