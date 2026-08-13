import { useState } from "react";
import { createReviewable, type VocabCard } from "../../domain/card";
import type { CardRepository } from "../../data/cardRepository";
import { EditableCardRow, type CardEditValues } from "./EditableCardRow";

interface ExistingCardsListProps {
  repository: CardRepository;
  onChange: () => void;
}

export function ExistingCardsList({ repository, onChange }: ExistingCardsListProps) {
  const [cards, setCards] = useState<VocabCard[]>(() => repository.getAllCards());
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<CardEditValues | null>(null);

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
    if (expandedCardId === card.id) {
      setExpandedCardId(null);
      setEditValues(null);
    }
    setCards(repository.getAllCards());
    onChange();
  }

  function handleToggleExpand(card: VocabCard) {
    if (expandedCardId === card.id) {
      setExpandedCardId(null);
      setEditValues(null);
      return;
    }
    setExpandedCardId(card.id);
    setEditValues({ korean: card.korean, english: card.english, example: card.example });
  }

  function handleEditChange(field: keyof CardEditValues, value: string) {
    setEditValues((current) => (current ? { ...current, [field]: value } : current));
  }

  function handleSave(card: VocabCard) {
    if (!editValues) return;
    const korean = editValues.korean.trim();
    const english = editValues.english.trim();
    if (!korean || !english) return;
    const updatedCard: VocabCard = {
      ...card,
      korean,
      english,
      example: editValues.example.trim(),
    };
    repository.saveCard(updatedCard);
    setCards(repository.getAllCards());
    setExpandedCardId(null);
    setEditValues(null);
    onChange();
  }

  function handleCancel() {
    setExpandedCardId(null);
    setEditValues(null);
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-jindo-blue/20 bg-white p-6 shadow-lg">
      <p className="text-sm font-medium text-jindo-charcoal">Your cards</p>
      <ul className="flex flex-col divide-y divide-jindo-blue/10">
        {cards.map((card) => (
          <EditableCardRow
            key={card.id}
            card={card}
            isExpanded={expandedCardId === card.id}
            editValues={expandedCardId === card.id ? editValues : null}
            onToggleExpand={() => handleToggleExpand(card)}
            onEditChange={handleEditChange}
            onSave={() => handleSave(card)}
            onCancel={handleCancel}
            onToggleProduction={(enabled) => handleToggleProduction(card, enabled)}
            onDelete={() => handleDelete(card)}
          />
        ))}
      </ul>
    </div>
  );
}
