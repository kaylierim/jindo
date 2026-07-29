import { useMemo, useState } from 'react'
import { createCard } from './domain/card'
import { LocalStorageCardRepository } from './data/localStorageCardRepository'
import { StudySession } from './features/study-session/StudySession'
import { AddCardForm } from './features/manage-cards/AddCardForm'

const STARTER_DECK: [korean: string, english: string, example: string][] = [
  ['안녕하세요', 'Hello', '안녕하세요, 저는 학생이에요.'],
  ['감사합니다', 'Thank you', '도와주셔서 감사합니다.'],
  ['사랑', 'Love', '가족을 사랑해요.'],
  ['친구', 'Friend', '그는 제 가장 친한 친구예요.'],
  ['학교', 'School', '저는 매일 학교에 가요.'],
]

type View = 'study' | 'add'

function App() {
  const repository = useMemo(() => {
    const repo = new LocalStorageCardRepository()
    if (repo.getAll().length === 0) {
      for (const [korean, english, example] of STARTER_DECK) {
        repo.save(createCard(korean, english, example))
      }
    }
    return repo
  }, [])

  const [view, setView] = useState<View>('study')
  const [cardsVersion, setCardsVersion] = useState(0)

  return (
    <div className="flex min-h-svh flex-col items-center bg-jindo-cream p-8 text-jindo-charcoal">
      <h1 className="mb-8 text-2xl font-medium">Jindo</h1>
      <button
        type="button"
        onClick={() => setView((current) => (current === 'study' ? 'add' : 'study'))}
        className="mb-6 text-sm font-medium text-jindo-blue underline"
      >
        {view === 'study' ? '+ Add a card' : '← Back to study'}
      </button>
      {view === 'study' ? (
        <StudySession key={cardsVersion} repository={repository} />
      ) : (
        <AddCardForm
          repository={repository}
          onCardAdded={() => {
            setCardsVersion((version) => version + 1)
            setView('study')
          }}
        />
      )}
    </div>
  )
}

export default App
