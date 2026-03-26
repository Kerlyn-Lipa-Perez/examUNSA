'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useExamStore } from '@/store/examStore';
import { loadExam } from '@/data/exams/loader';
import { ExamHeader } from '@/components/simulacro/ExamHeader';
import { QuestionCard } from '@/components/simulacro/QuestionCard';
import { OptionButton } from '@/components/simulacro/OptionButton';
import { NavigationButtons } from '@/components/simulacro/NavigationButtons';
import { AREA_CONFIG, ExamArea } from '@/types/simulacro';

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const area = params.area as ExamArea;
  const examId = params.examId as string;

  const {
    examData,
    currentQuestionIndex,
    userAnswers,
    status,
    startExam,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    finishExam,
    resetExam,
    getCurrentQuestion,
    getCurrentAnswer,
  } = useExamStore();

  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await loadExam('UNSA', area, examId);
      if (data) {
        if (data.preguntas.length === 0) {
  
          setLoading(false);
          return;
        }
        startExam(data);
      }
      setLoading(false);
    }


    if (status === 'idle') {
      load();
    } else {
      setLoading(false);
    }

   
    return () => {

    };
  }, [area, examId]); 


  useEffect(() => {
    if (status === 'finished') {
      router.push(`/simulacros/UNSA/${area}/${examId}/results`);
    }
  }, [status, router, area, examId]);


  if (status === 'submitting') {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neutral-700 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 font-mono text-sm">Guardando resultados...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neutral-700 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 font-mono text-sm">Cargando examen...</p>
        </div>
      </div>
    );
  }

  // No exam data or no questions
  if (!examData || examData.preguntas.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 space-y-4">
        <div className="text-5xl mb-4">📝</div>
        <h1 className="text-2xl font-bold text-white">Examen no disponible</h1>
        <p className="text-gray-400">
          Las preguntas para este examen aún no están disponibles. Intenta con otro examen.
        </p>
        <button
          onClick={() => {
            resetExam();
            router.push(`/simulacros/UNSA/${area}`);
          }}
          className="mt-6 bg-primary hover:bg-yellow-600 text-neutral-900 font-bold px-6 py-2.5 rounded-lg transition-colors"
        >
          ← Volver a exámenes
        </button>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const currentAnswer = getCurrentAnswer();
  const totalAnswered = userAnswers.filter((a) => a.respuesta !== null).length;
  const totalQuestions = examData.preguntas.length;

  const handleFinish = () => {
    if (totalAnswered < totalQuestions) {
      setShowConfirm(true);
    } else {
      finishExam();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col -m-8">
      {/* Header */}
      <ExamHeader />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-4 py-8 max-w-3xl mx-auto w-full">
        {currentQuestion && (
          <>
            {/* Question */}
            <QuestionCard question={currentQuestion} />

            {/* Options */}
            <div className="w-full space-y-3 mt-6">
              {(['A', 'B', 'C', 'D', 'E'] as const).map((letter) => (
                <OptionButton
                  key={letter}
                  letter={letter}
                  text={currentQuestion.opciones[letter]}
                  isSelected={currentAnswer === letter}
                  onClick={() => selectAnswer(currentQuestion.id, letter)}
                  imageSrc={currentQuestion.imagenOpcion?.[letter]}
                />
              ))}
            </div>

            {/* Navigation */}
            <NavigationButtons
              onPrev={prevQuestion}
              onNext={nextQuestion}
              onFinish={handleFinish}
              hasPrev={currentQuestionIndex > 0}
              hasNext={currentQuestionIndex < totalQuestions - 1}
              isLastQuestion={currentQuestionIndex === totalQuestions - 1}
              totalAnswered={totalAnswered}
              totalQuestions={totalQuestions}
            />

            {/* Question Map */}
            <div className="mt-8 w-full">
              <h4 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-3">Mapa de preguntas</h4>
              <div className="flex flex-wrap gap-2">
                {examData.preguntas.map((q, idx) => {
                  const answer = userAnswers.find((a) => a.preguntaId === q.id);
                  const isAnswered = answer?.respuesta !== null;
                  const isCurrent = idx === currentQuestionIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => useExamStore.getState().goToQuestion(idx)}
                      className={`w-9 h-9 rounded-lg font-mono text-xs font-bold transition-all duration-200 ${
                        isCurrent
                          ? 'bg-primary text-neutral-900 ring-2 ring-primary/30'
                          : isAnswered
                          ? 'bg-neutral-700 text-white border border-neutral-border'
                          : 'bg-neutral-800 text-gray-500 border border-neutral-border hover:bg-neutral-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border max-w-md w-full space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">¿Finalizar examen?</h3>
              <p className="text-gray-400 text-sm">
                Tienes <span className="font-mono text-primary font-bold">{totalQuestions - totalAnswered}</span> preguntas sin responder.
                ¿Estás seguro de que deseas finalizar?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                Seguir respondiendo
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  finishExam();
                }}
                className="flex-1 bg-primary hover:bg-yellow-600 text-neutral-900 py-2.5 rounded-lg font-bold transition-colors"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
