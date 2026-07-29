import { useState, type FormEvent } from 'react'
import { createCard } from '../../domain/card'
import type { CardRepository } from '../../data/cardRepository'

interface AddCardFormProps {
  repository: CardRepository
  onCardAdded: () => void
}

export function AddCardForm({ repository, onCardAdded }: AddCardFormProps) {
  const [korean, setKorean] = useState('')
  const [english, setEnglish] = useState('')
  const [example, setExample] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    repository.save(createCard(korean.trim(), english.trim(), example.trim()))
    setKorean('')
    setEnglish('')
    setExample('')
    onCardAdded()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-jindo-blue/20 bg-white p-6 shadow-lg"
    >
      <label className="flex flex-col gap-1 text-left text-sm text-jindo-charcoal">
        Korean word
        <input
          value={korean}
          onChange={(event) => setKorean(event.target.value)}
          required
          className="rounded-lg border border-jindo-blue/20 px-3 py-2 text-base"
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
          required
          className="rounded-lg border border-jindo-blue/20 px-3 py-2 text-base"
        />
      </label>
      <button
        type="submit"
        className="mt-2 rounded-full bg-jindo-blue px-5 py-2 text-sm font-medium text-white"
      >
        Add card
      </button>
    </form>
  )
}
