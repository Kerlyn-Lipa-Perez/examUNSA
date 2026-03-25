'use client';

import { Question } from '@/types/simulacro';
import Image from 'next/image';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="bg-neutral-800 rounded-xl p-6 sm:p-8 border border-neutral-border">
      {/* Question text */}
      <p className="font-mono text-base sm:text-lg text-gray-100 leading-relaxed whitespace-pre-wrap">
        {question.texto}
      </p>

      {/* Optional question image */}
      {question.imagen && (
        <div className="mt-4 flex justify-center">
          <div className="relative max-w-md w-full rounded-lg overflow-hidden border border-neutral-border">
            <Image
              src={question.imagen}
              alt="Imagen de la pregunta"
              width={500}
              height={300}
              className="w-full h-auto object-contain bg-neutral-900"
            />
          </div>
        </div>
      )}
    </div>
  );
}
