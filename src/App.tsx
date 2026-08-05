import { useMemo, useState } from "react";
import { createCard, createReviewable } from "./domain/card";
import { LocalStorageCardRepository } from "./data/localStorageCardRepository";
import { StudySession } from "./features/study-session/StudySession";
import { AddCardForm } from "./features/manage-cards/AddCardForm";
import { GuidedSession } from "./features/guided-session/GuidedSession";

const STARTER_DECK: [korean: string, english: string, example: string][] = [
  ["안녕하세요", "Hello", "안녕하세요, 저는 학생이에요."],
  ["감사합니다", "Thank you", "도와주셔서 감사합니다."],
  ["사랑", "Love", "가족을 사랑해요."],
  ["친구", "Friend", "그는 제 가장 친한 친구예요."],
  ["학교", "School", "저는 매일 학교에 가요."],
];

type View = "study" | "guided" | "add";

const TABS: { view: View; label: string }[] = [
  { view: "study", label: "Study" },
  { view: "guided", label: "Guided Session" },
  { view: "add", label: "Add Card" },
];

function App() {
  const repository = useMemo(() => {
    const repo = new LocalStorageCardRepository();
    if (repo.getAllCards().length === 0) {
      for (const [korean, english, example] of STARTER_DECK) {
        const card = createCard(korean, english, example);
        repo.saveCard(card);
        repo.saveReviewable(createReviewable(card.id, "recognition"));
        if (card.productionEnabled) {
          repo.saveReviewable(createReviewable(card.id, "production"));
        }
      }
    }
    return repo;
  }, []);

  const [view, setView] = useState<View>("study");
  const [cardsVersion, setCardsVersion] = useState(0);

  return (
    <div className="flex min-h-svh flex-col items-center bg-jindo-cream text-jindo-charcoal p-16">
      <h1 className="mb-12 font-heading text-6xl font-medium">Jindo</h1>
      <div className="mb-6 flex gap-1 rounded-full bg-white p-1 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.view}
            type="button"
            onClick={() => setView(tab.view)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              view === tab.view
                ? "bg-jindo-blue text-white"
                : "text-jindo-charcoal"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {view === "study" && (
        <StudySession key={cardsVersion} repository={repository} />
      )}
      {view === "guided" && <GuidedSession />}
      {view === "add" && (
        <AddCardForm
          repository={repository}
          onCardAdded={() => {
            setCardsVersion((version) => version + 1);
            setView("study");
          }}
        />
      )}
    </div>
  );
}

export default App;
