'use client';

interface NavigationButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isLastQuestion: boolean;
  totalAnswered: number;
  totalQuestions: number;
}

export function NavigationButtons({
  onPrev,
  onNext,
  onFinish,
  hasPrev,
  hasNext,
  isLastQuestion,
  totalAnswered,
  totalQuestions,
}: NavigationButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <div className="flex items-center gap-4 w-full max-w-md">
        {/* Previous */}
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
            hasPrev
              ? 'bg-neutral-800 text-gray-300 hover:bg-neutral-700 hover:text-white border border-neutral-border'
              : 'bg-neutral-800/50 text-gray-600 border border-transparent cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        <div className="flex-1" />

        {/* Next or Finish */}
        {isLastQuestion ? (
          <button
            onClick={onFinish}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-yellow-600 text-neutral-900 font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Finalizar examen
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-yellow-600 text-neutral-900 font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Siguiente pregunta
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Answered counter */}
      <p className="text-gray-500 text-xs font-mono">
        {totalAnswered}/{totalQuestions} respondidas
      </p>
    </div>
  );
}
