import type { ScheduledCard } from '../domain/card'

export interface CardRepository {
  getAll(): ScheduledCard[]
  getDue(now?: Date): ScheduledCard[]
  save(card: ScheduledCard): void
}
