import type { Reviewable, ReviewDirection, VocabCard } from '../domain/card'

export interface DueReview {
  card: VocabCard
  reviewable: Reviewable
}

export interface CardRepository {
  getAllCards(): VocabCard[]
  saveCard(card: VocabCard): void
  deleteCard(cardId: string): void
  getReviewable(cardId: string, direction: ReviewDirection): Reviewable | undefined
  saveReviewable(reviewable: Reviewable): void
  getDueReviews(now?: Date): DueReview[]
}
