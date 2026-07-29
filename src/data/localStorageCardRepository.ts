import { isDue, type ScheduledCard } from '../domain/card'
import type { CardRepository } from './cardRepository'

const STORAGE_KEY = 'jindo:cards'

// JSON.stringify turns Date fields into strings, so they need to be revived on read.
function reviveDates(card: ScheduledCard): ScheduledCard {
  return {
    ...card,
    fsrs: {
      ...card.fsrs,
      due: new Date(card.fsrs.due),
      last_review: card.fsrs.last_review ? new Date(card.fsrs.last_review) : undefined,
    },
  }
}

function readAll(): ScheduledCard[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  const parsed = JSON.parse(raw) as ScheduledCard[]
  return parsed.map(reviveDates)
}

function writeAll(cards: ScheduledCard[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

export class LocalStorageCardRepository implements CardRepository {
  getAll(): ScheduledCard[] {
    return readAll()
  }

  getDue(now: Date = new Date()): ScheduledCard[] {
    return readAll().filter((card) => isDue(card, now))
  }

  save(card: ScheduledCard): void {
    const cards = readAll()
    const index = cards.findIndex((existing) => existing.id === card.id)
    if (index === -1) {
      cards.push(card)
    } else {
      cards[index] = card
    }
    writeAll(cards)
  }
}
