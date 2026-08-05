import { useState } from "react";
import { createReviewable, type VocabCard } from "../../domain/card";
import type { CardRepository } from "../../data/cardRepository";

interface ExistingCardsListProps {
  repository: CardRepository;
  onChange: () => void;
}

export function ExistingCardsList({ repository, onChange }: ExistingCardsListProps) {
  const [cards, setCards] = useState<VocabCard[]>(() => repository.getAllCards());

  function handleToggleProduction(card: VocabCard, enabled: boolean) {
    if (enabled && !repository.getReviewable(card.id, "production")) {
      repository.saveReviewable(createReviewable(card.id, "production"));
    }
    repository.saveCard({ ...card, productionEnabled: enabled });
    setCards(repository.getAllCards());
    onChange();
  }

  function handleDelete(card: VocabCard) {
    repository.deleteCard(card.id);
    setCards(repository.getAllCards());
    onChange();
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-jindo-blue/20 bg-white p-6 shadow-lg">
      <p className="text-sm font-medium text-jindo-charcoal">Your cards</p>
      <ul className="flex flex-col divide-y divide-jindo-blue/10">
        {cards.map((card) => (
          <li key={card.id} className="flex items-center justify-between gap-3 py-2">
            <span className="text-sm text-jindo-charcoal">
              <span className="font-korean">{card.korean}</span> — {card.english}
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-jindo-charcoal/70">
                <input
                  type="checkbox"
                  checked={card.productionEnabled}
                  onChange={(event) => handleToggleProduction(card, event.target.checked)}
                  className="h-4 w-4 rounded border-jindo-blue/20"
                />
                Practice production
              </label>
              <button
                type="button"
                onClick={() => handleDelete(card)}
                className="text-xs font-medium text-jindo-terracotta"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
