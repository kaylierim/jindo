import { isDue, type Reviewable, type ReviewDirection, type VocabCard } from '../domain/card'
import type { CardRepository, DueReview } from './cardRepository'

const CARDS_STORAGE_KEY = 'jindo:vocabCards'
const REVIEWABLES_STORAGE_KEY = 'jindo:reviewables'

// JSON.stringify turns Date fields into strings, so they need to be revived on read.
function reviveDates(reviewable: Reviewable): Reviewable {
  return {
    ...reviewable,
    fsrs: {
      ...reviewable.fsrs,
      due: new Date(reviewable.fsrs.due),
      last_review: reviewable.fsrs.last_review ? new Date(reviewable.fsrs.last_review) : undefined,
    },
  }
}

function readCards(): VocabCard[] {
  const raw = localStorage.getItem(CARDS_STORAGE_KEY)
  if (!raw) return []
  return JSON.parse(raw) as VocabCard[]
}

function writeCards(cards: VocabCard[]): void {
  localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards))
}

function readReviewables(): Reviewable[] {
  const raw = localStorage.getItem(REVIEWABLES_STORAGE_KEY)
  if (!raw) return []
  const parsed = JSON.parse(raw) as Reviewable[]
  return parsed.map(reviveDates)
}

function writeReviewables(reviewables: Reviewable[]): void {
  localStorage.setItem(REVIEWABLES_STORAGE_KEY, JSON.stringify(reviewables))
}

export class LocalStorageCardRepository implements CardRepository {
  getAllCards(): VocabCard[] {
    return readCards()
  }

  saveCard(card: VocabCard): void {
    const cards = readCards()
    const index = cards.findIndex((existing) => existing.id === card.id)
    if (index === -1) {
      cards.push(card)
    } else {
      cards[index] = card
    }
    writeCards(cards)
  }

  deleteCard(cardId: string): void {
    const cards = readCards().filter((existing) => existing.id !== cardId)
    writeCards(cards)

    const reviewables = readReviewables().filter((existing) => existing.cardId !== cardId)
    writeReviewables(reviewables)
  }

  getReviewable(cardId: string, direction: ReviewDirection): Reviewable | undefined {
    return readReviewables().find(
      (existing) => existing.cardId === cardId && existing.direction === direction
    )
  }

  saveReviewable(reviewable: Reviewable): void {
    const reviewables = readReviewables()
    const index = reviewables.findIndex(
      (existing) => existing.cardId === reviewable.cardId && existing.direction === reviewable.direction
    )
    if (index === -1) {
      reviewables.push(reviewable)
    } else {
      reviewables[index] = reviewable
    }
    writeReviewables(reviewables)
  }

  getDueReviews(now: Date = new Date()): DueReview[] {
    const cards = readCards()
    const dueReviews: DueReview[] = []

    for (const reviewable of readReviewables()) {
      if (!isDue(reviewable, now)) continue

      const card = cards.find((existing) => existing.id === reviewable.cardId)
      if (!card) continue
      if (reviewable.direction === 'production' && !card.productionEnabled) continue

      dueReviews.push({ card, reviewable })
    }

    return dueReviews
  }

  getAllReviewables(): Reviewable[] {
    return readReviewables()
  }
}
