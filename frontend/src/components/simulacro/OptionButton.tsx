'use client';

interface OptionButtonProps {
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;  // Used in review mode
  isWrong?: boolean;    // Used in review mode
  showResult?: boolean; // Whether we're in review mode
  onClick: () => void;
  disabled?: boolean;
  imageSrc?: string;
}

export function OptionButton({
  letter,
  text,
  isSelected,
  isCorrect,
  isWrong,
  showResult = false,
  onClick,
  disabled = false,
  imageSrc,
}: OptionButtonProps) {
  // Determine visual state
  let containerClasses = 'bg-neutral-800 border-neutral-border hover:bg-neutral-700';
  let letterClasses = 'bg-neutral-700 text-gray-400';
  let checkmark = false;

  if (showResult && isCorrect) {
    containerClasses = 'bg-success/10 border-success/40';
    letterClasses = 'bg-success text-white';
    checkmark = true;
  } else if (showResult && isWrong) {
    containerClasses = 'bg-error/10 border-error/40';
    letterClasses = 'bg-error text-white';
  } else if (isSelected) {
    containerClasses = 'bg-neutral-800 border-primary/60 ring-1 ring-primary/30';
    letterClasses = 'bg-primary text-neutral-900';
    checkmark = true;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${containerClasses} ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      } group`}
    >
      {/* Letter badge */}
      <span
        className={`w-8 h-8 flex items-center justify-center rounded-md font-mono text-sm font-bold flex-shrink-0 transition-colors duration-200 ${letterClasses}`}
      >
        {letter}
      </span>

      {/* Option text */}
      <span className="font-mono text-sm sm:text-base text-gray-200 text-left flex-1">
        {text}
      </span>

      {/* Option image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={`Opción ${letter}`}
          className="max-h-16 rounded border border-neutral-border"
        />
      )}

      {/* CheckMark */}
      {checkmark && (
        <span className="flex-shrink-0 ml-auto">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
