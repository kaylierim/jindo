import { useState, type FormEvent } from "react";
import { createCard, createReviewable } from "../../domain/card";
import type { CardRepository } from "../../data/cardRepository";
import { ExistingCardsList } from "./ExistingCardsList";

interface AddCardFormProps {
  repository: CardRepository;
  onCardAdded: () => void;
}

export function AddCardForm({ repository, onCardAdded }: AddCardFormProps) {
  const [korean, setKorean] = useState("");
  const [english, setEnglish] = useState("");
  const [example, setExample] = useState("");
  const [practiceProduction, setPracticeProduction] = useState(true);
  const [cardsVersion, setCardsVersion] = useState(0);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const card = createCard(korean.trim(), english.trim(), example.trim(), practiceProduction);
    repository.saveCard(card);
    repository.saveReviewable(createReviewable(card.id, "recognition"));
    if (practiceProduction) {
      repository.saveReviewable(createReviewable(card.id, "production"));
    }
    setKorean("");
    setEnglish("");
    setExample("");
    setPracticeProduction(true);
    setCardsVersion((version) => version + 1);
    onCardAdded();
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 rounded-2xl border border-jindo-blue/20 bg-white p-6 shadow-lg"
      >
        <label className="flex flex-col gap-1 text-left text-sm text-jindo-charcoal">
          Korean word
          <input
            value={korean}
            onChange={(event) => setKorean(event.target.value)}
            required
            className="rounded-lg border border-jindo-blue/20 px-3 py-2 font-korean text-base"
          />
        </label>
        <label className="flex flex-col gap-1 text-left text-sm text-jindo-charcoal">
          English meaning
          <input
            value={english}
            onChange={(event) => setEnglish(event.target.value)}
            required
            className="rounded-lg border border-jindo-blue/20 px-3 py-2 text-base"
          />
        </label>
        <label className="flex flex-col gap-1 text-left text-sm text-jindo-charcoal">
          Example sentence
          <input
            value={example}
            onChange={(event) => setExample(event.target.value)}
            className="rounded-lg border border-jindo-blue/20 px-3 py-2 font-korean text-base"
          />
        </label>
        <label className="flex items-center gap-2 text-left text-sm text-jindo-charcoal">
          <input
            type="checkbox"
            checked={practiceProduction}
            onChange={(event) => setPracticeProduction(event.target.checked)}
            className="h-4 w-4 rounded border-jindo-blue/20"
          />
          Also practice production (English → Korean)
        </label>
        <button
          type="submit"
          className="mt-2 rounded-full bg-jindo-blue px-5 py-2 text-sm font-medium text-white"
        >
          Add card
        </button>
      </form>
      <ExistingCardsList
        key={cardsVersion}
        repository={repository}
        onChange={() => setCardsVersion((version) => version + 1)}
      />
    </div>
  );
}
