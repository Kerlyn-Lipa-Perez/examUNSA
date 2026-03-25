// frontend/src/store/examStore.ts
import { create } from 'zustand';
import { Question, UserAnswer, ExamData } from '@/types/simulacro';

interface ExamState {
  // Exam data
  examData: ExamData | null;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];

  // Timer
  tiempoRestanteSegundos: number;
  timerActive: boolean;

  // Status
  status: 'idle' | 'loading' | 'in-progress' | 'finished';

  // Actions
  startExam: (examData: ExamData) => void;
  selectAnswer: (preguntaId: number, respuesta: 'A' | 'B' | 'C' | 'D' | 'E') => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  tick: () => void;
  finishExam: () => void;
  resetExam: () => void;

  // Computed-like helpers
  getCurrentQuestion: () => Question | null;
  getCurrentAnswer: () => string | null;
  getScore: () => { correctas: number; incorrectas: number; sinResponder: number };
}

export const useExamStore = create<ExamState>()((set, get) => ({
  examData: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  tiempoRestanteSegundos: 0,
  timerActive: false,
  status: 'idle',

  startExam: (examData: ExamData) => {
    const answers: UserAnswer[] = examData.preguntas.map((p) => ({
      preguntaId: p.id,
      respuesta: null,
    }));
    set({
      examData,
      currentQuestionIndex: 0,
      userAnswers: answers,
      tiempoRestanteSegundos: examData.meta.tiempoMinutos * 60,
      timerActive: true,
      status: 'in-progress',
    });
  },

  selectAnswer: (preguntaId, respuesta) => {
    set((state) => ({
      userAnswers: state.userAnswers.map((a) =>
        a.preguntaId === preguntaId ? { ...a, respuesta } : a,
      ),
    }));
  },

  goToQuestion: (index) => {
    const { examData } = get();
    if (examData && index >= 0 && index < examData.preguntas.length) {
      set({ currentQuestionIndex: index });
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, examData } = get();
    if (examData && currentQuestionIndex < examData.preguntas.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  tick: () => {
    const { tiempoRestanteSegundos, timerActive } = get();
    if (timerActive && tiempoRestanteSegundos > 0) {
      set({ tiempoRestanteSegundos: tiempoRestanteSegundos - 1 });
    } else if (tiempoRestanteSegundos <= 0 && timerActive) {
      get().finishExam();
    }
  },

  finishExam: () => {
    set({ status: 'finished', timerActive: false });
  },

  resetExam: () => {
    set({
      examData: null,
      currentQuestionIndex: 0,
      userAnswers: [],
      tiempoRestanteSegundos: 0,
      timerActive: false,
      status: 'idle',
    });
  },

  getCurrentQuestion: () => {
    const { examData, currentQuestionIndex } = get();
    if (!examData) return null;
    return examData.preguntas[currentQuestionIndex] || null;
  },

  getCurrentAnswer: () => {
    const { examData, currentQuestionIndex, userAnswers } = get();
    if (!examData) return null;
    const question = examData.preguntas[currentQuestionIndex];
    const answer = userAnswers.find((a) => a.preguntaId === question?.id);
    return answer?.respuesta || null;
  },

  getScore: () => {
    const { examData, userAnswers } = get();
    if (!examData) return { correctas: 0, incorrectas: 0, sinResponder: 0 };

    let correctas = 0;
    let incorrectas = 0;
    let sinResponder = 0;

    userAnswers.forEach((answer) => {
      const question = examData.preguntas.find((p) => p.id === answer.preguntaId);
      if (!question) return;

      if (answer.respuesta === null) {
        sinResponder++;
      } else if (answer.respuesta === question.respuestaCorrecta) {
        correctas++;
      } else {
        incorrectas++;
      }
    });

    return { correctas, incorrectas, sinResponder };
  },
}));
