import type { ReviewDirection } from "../domain/card";

interface FlashcardProps {
  korean: string;
  english: string;
  example: string;
  direction: ReviewDirection;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Flashcard({
  korean,
  english,
  example,
  direction,
  isFlipped,
  onFlip,
}: FlashcardProps) {
  const front = direction === "recognition" ? korean : english;
  const back = direction === "recognition" ? english : korean;
  const frontIsKorean = direction === "recognition";
  const backIsKorean = direction === "production";

  const faceClasses =
    "absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-y-auto rounded-2xl border border-jindo-blue/20 bg-white p-8 text-center shadow-lg [backface-visibility:hidden]";

  return (
    <button
      type="button"
      onClick={onFlip}
      className="relative h-64 w-96 [perspective:1000px]"
    >
      <div
        className={`relative h-full w-full [transform-style:preserve-3d] transition-transform duration-300 ease-in-out ${
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]"
        }`}
      >
        <div className={faceClasses}>
          <p
            className={`text-3xl font-medium text-jindo-charcoal ${frontIsKorean ? "font-korean text-4xl" : ""}`}
          >
            {front}
          </p>
        </div>
        <div className={`${faceClasses} [transform:rotateY(180deg)]`}>
          <p
            className={`text-3xl text-jindo-blue ${backIsKorean ? "font-korean text-4xl" : ""}`}
          >
            {back}
          </p>
          <p className="font-korean text-2xl text-jindo-charcoal/70 italic">
            {example}
          </p>
        </div>
      </div>
    </button>
  );
}
