'use client';

import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  BookOpen,
  BrainCircuit,
  BarChart3,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  Trophy,
  ArrowRight,
  GraduationCap,
  Clock,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 selection:bg-primary/30 selection:text-primary">
      {/* ─── Navbar ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-neutral-900/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <GraduationCap className="w-5 h-5 text-neutral-900" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Combo <span className="text-primary">UNSA</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Simulacros', href: '#simulacros' },
              { label: 'Método', href: '#metodo' },
              { label: 'Materias', href: '#materias' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-[#8B949E] hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors"
            >
              Ingresar
            </Link>
            <Link
              href="/registro"
              className="px-5 py-2 text-sm font-bold bg-primary text-neutral-900 rounded-lg hover:bg-yellow-600 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* ─── Hero ──────────────────────────────────────────────────── */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Static ambient gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(212,160,23,0.06),transparent)] pointer-events-none" />
          {/* Subtle grid */}
          <div className="absolute inset-0 grid-pattern pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left column — Copy */}
              <div>
                {/* Badge */}
                <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-800/80 border border-primary/20 text-xs font-bold text-primary mb-8 backdrop-blur-sm">
                  <Zap className="w-3.5 h-3.5" />
                  <span>PREPARACIÓN INTELIGENTE PARA UNSA</span>
                </div>

                <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                  Tu vacante en la{' '}
                  <span className="relative">
                    <span className="relative z-10 bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
                      UNSA
                    </span>
                    <span className="absolute bottom-1 left-0 right-0 h-3 bg-primary/15 rounded-sm -z-0" />
                  </span>{' '}
                  empieza aquí
                </h1>

                <p className="animate-fade-in-up delay-200 text-lg text-[#9CA3AF] max-w-lg mb-10 leading-relaxed">
                  Simulacros adaptativos con IA, flashcards con repaso espaciado y métricas que predicen tu ingreso. El sistema de preparación más avanzado de Arequipa.
                </p>

                <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    href="/registro"
                    className="group w-full sm:w-auto px-8 py-4 bg-primary text-neutral-900 rounded-xl font-bold text-base flex items-center justify-center gap-3 hover:bg-yellow-600 transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                  >
                    Empezar ahora — es gratis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#simulacros"
                    className="w-full sm:w-auto px-8 py-4 text-[#9CA3AF] rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:text-white hover:bg-white/5 transition-all border border-white/5"
                  >
                    Cómo funciona
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Trust line */}
                <div className="animate-fade-in-up delay-400 mt-10 flex items-center gap-4 text-sm text-[#8B949E]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-success" />
                    <span>Sin tarjeta de crédito</span>
                  </div>
                  <span className="text-neutral-700">·</span>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-success" />
                    <span>3 simulacros gratis</span>
                  </div>
                </div>
              </div>

              {/* Right column — Mock exam card */}
              <div className="animate-fade-in-up delay-500 hidden lg:block">
                <div className="relative">
                  {/* Floating decorative elements */}
                  <div className="absolute -top-6 -left-6 w-20 h-20 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center backdrop-blur-sm">
                    <Check className="w-8 h-8 text-success" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center backdrop-blur-sm">
                    <Clock className="w-7 h-7 text-error" />
                  </div>

                  {/* Main card — exam preview */}
                  <div className="bg-neutral-800/90 rounded-2xl border border-white/5 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur-sm">
                    {/* Card header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-sm font-semibold text-white">Simulacro en progreso</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-error/10 border border-error/20">
                        <Clock className="w-3.5 h-3.5 text-error" />
                        <span className="font-mono text-sm font-bold text-error">24:37</span>
                      </div>
                    </div>

                    {/* Question area */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-2.5 py-1 rounded-md bg-success/10 text-success text-xs font-bold">BIOLOGÍA</span>
                        <span className="font-mono text-xs text-[#8B949E]">Pregunta 14 de 20</span>
                      </div>

                      <p className="font-mono text-sm text-gray-100 leading-relaxed mb-6">
                        ¿Cuál de los siguientes orgánulos es responsable de la producción de ATP mediante fosforilación oxidativa?
                      </p>

                      <div className="space-y-2.5">
                        {[
                          { label: 'A', text: 'Aparato de Golgi', active: false },
                          { label: 'B', text: 'Mitocondria', active: true },
                          { label: 'C', text: 'Ribosoma', active: false },
                          { label: 'D', text: 'Lisosoma', active: false },
                        ].map((opt) => (
                          <div
                            key={opt.label}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                              opt.active
                                ? 'border-primary/40 bg-primary/5'
                                : 'border-white/5 bg-neutral-700/50 hover:border-white/10'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                              opt.active ? 'bg-primary text-neutral-900' : 'bg-neutral-800 text-[#8B949E]'
                            }`}>
                              {opt.label}
                            </span>
                            <span className="text-sm text-gray-100">{opt.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div className="mt-6 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                          <div className="h-full w-[70%] bg-gradient-to-r from-primary to-yellow-400 rounded-full" />
                        </div>
                        <span className="font-mono text-xs font-bold text-primary">70%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Stats ────────────────────────────────────────────── */}
            <div className="animate-fade-in-up delay-600 mt-20 lg:mt-28 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="animate-counter delay-100 text-center py-6 rounded-xl bg-neutral-800/40 border border-white/5 hover:border-primary/20 transition-all group">
                <div className="font-mono text-3xl sm:text-4xl font-bold text-primary group-hover:scale-110 transition-transform">10K+</div>
                <div className="text-xs font-medium text-[#8B949E] uppercase tracking-[0.2em] mt-2">Preguntas</div>
              </div>
              <div className="animate-counter delay-200 text-center py-6 rounded-xl bg-neutral-800/40 border border-white/5 hover:border-primary/20 transition-all group">
                <div className="font-mono text-3xl sm:text-4xl font-bold text-info group-hover:scale-110 transition-transform">98.4%</div>
                <div className="text-xs font-medium text-[#8B949E] uppercase tracking-[0.2em] mt-2">Precisión IA</div>
              </div>
              <div className="animate-counter delay-300 text-center py-6 rounded-xl bg-neutral-800/40 border border-white/5 hover:border-primary/20 transition-all group">
                <div className="font-mono text-3xl sm:text-4xl font-bold text-success group-hover:scale-110 transition-transform">1,200+</div>
                <div className="text-xs font-medium text-[#8B949E] uppercase tracking-[0.2em] mt-2">Ingresantes</div>
              </div>
              <div className="animate-counter delay-400 text-center py-6 rounded-xl bg-neutral-800/40 border border-white/5 hover:border-primary/20 transition-all group">
                <div className="font-mono text-3xl sm:text-4xl font-bold text-warning group-hover:scale-110 transition-transform">4.9★</div>
                <div className="text-xs font-medium text-[#8B949E] uppercase tracking-[0.2em] mt-2">Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Features — Subject Cards ─────────────────────────────── */}
        <section className="py-28 relative" id="simulacros">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-900/50 to-neutral-900 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl mb-16">
              <span className="text-xs font-bold text-primary uppercase tracking-[0.25em] mb-4 block">Herramientas</span>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                Cada materia, un <br />
                <span className="text-primary">sistema diferente</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed">
                No es una app genérica. Cada materia tiene su propio motor de evaluación con algoritmos diseñados para el temario UNSA.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 — Simulacros (Primary/Gold) */}
              <div className="group relative p-8 rounded-2xl bg-neutral-800/60 border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
                {/* Subject color strip */}
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-to-b from-primary to-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <BrainCircuit className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Simulacros Adaptativos</h3>
                <p className="text-[#9CA3AF] leading-relaxed text-sm mb-6">
                  Nuestra IA analiza tus respuestas en tiempo real para ajustar la dificultad. Cada simulacro es único y ataca tus puntos débiles.
                </p>
                <ul className="space-y-2 mb-6">
                  {['CEPRUNSA y Ordinario', 'Modo examen real', 'Análisis de rendimiento'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#8B949E]">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center text-xs font-bold text-primary tracking-widest uppercase gap-1 group-hover:gap-2 transition-all">
                  Probar ahora <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 2 — Flashcards (Info/Blue) */}
              <div className="group relative p-8 rounded-2xl bg-neutral-800/60 border border-white/5 hover:border-info/30 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-to-b from-info to-tertiary opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="w-12 h-12 rounded-xl bg-info/10 border border-info/20 flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-info" />
                </div>
                <h3 className="text-xl font-bold mb-3">Flashcards con SRS</h3>
                <p className="text-[#9CA3AF] leading-relaxed text-sm mb-6">
                  Repaso Espaciado (SM-2) para Biología, Física, Historia y Cívica. El algoritmo sabe QUÉ repasar y CUÁNDO.
                </p>
                <ul className="space-y-2 mb-6">
                  {['Algoritmo SM-2', 'Barrido por materia', 'Progreso visual'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#8B949E]">
                      <Check className="w-3.5 h-3.5 text-info flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center text-xs font-bold text-info tracking-widest uppercase gap-1 group-hover:gap-2 transition-all">
                  Explorar mazos <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 3 — Analytics (Success/Green) */}
              <div className="group relative p-8 rounded-2xl bg-neutral-800/60 border border-white/5 hover:border-success/30 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-to-b from-success to-success opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-bold mb-3">Predictiva de Ingreso</h3>
                <p className="text-[#9CA3AF] leading-relaxed text-sm mb-6">
                  Nuestro modelo predice tu probabilidad real de ingreso basándose en tu historial. Datos duros, no suposiciones.
                </p>
                <ul className="space-y-2 mb-6">
                  {['Probabilidad en %', 'Comparativa histórica', 'Alertas de mejora'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#8B949E]">
                      <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center text-xs font-bold text-success tracking-widest uppercase gap-1 group-hover:gap-2 transition-all">
                  Ver métricas <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── How it works — Methodology ───────────────────────────── */}
        <section className="py-28 relative" id="metodo">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-primary uppercase tracking-[0.25em] mb-4 block">Método</span>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Tres pasos hacia tu <span className="text-primary">vacante</span>
              </h2>
            </div>

            <div className="space-y-16">
              {/* Step 01 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-shrink-0 relative">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-[#8B949E]">01</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-3">Diagnóstico inicial</h3>
                  <p className="text-[#9CA3AF] leading-relaxed max-w-md mx-auto md:mx-0">
                    Un simulacro de evaluación identifica tu nivel actual por materia. Nuestro algoritmo mapea tus fortalezas y debilidades en minutos.
                  </p>
                </div>
              </div>

              {/* Step 02 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
                <div className="flex-shrink-0 relative">
                  <div className="w-20 h-20 rounded-2xl bg-info/10 border border-info/20 flex items-center justify-center">
                    <BrainCircuit className="w-6 h-6 text-info" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-[#8B949E]">02</span>
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h3 className="text-2xl font-bold mb-3">Entrenamiento dirigido</h3>
                  <p className="text-[#9CA3AF] leading-relaxed max-w-md mx-auto md:ml-auto md:mx-0">
                    Simulacros adaptativos y flashcards personalizadas. El sistema ajusta el contenido según tu ritmo, enfocándose en lo que más necesitas.
                  </p>
                </div>
              </div>

              {/* Step 03 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-shrink-0 relative">
                  <div className="w-20 h-20 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-success" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-[#8B949E]">03</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-3">Predicción de ingreso</h3>
                  <p className="text-[#9CA3AF] leading-relaxed max-w-md mx-auto md:mx-0">
                    Antes del examen real, sabrás tu probabilidad real de ingreso. Métricas claras para que tomes la mejor decisión.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Subjects ──────────────────────────────────────────────── */}
        <section className="py-24 relative" id="materias">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-primary uppercase tracking-[0.25em] mb-4 block">Materias</span>
              <h2 className="text-3xl lg:text-4xl font-bold">
                Cubrimos <span className="text-primary">todo el temario</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="group p-5 rounded-xl bg-neutral-800/60 border border-white/5 border-l-info border-l-4 hover:border-white/10 transition-all cursor-default">
                <span className="text-2xl mb-3 block">📐</span>
                <span className="text-sm font-semibold text-gray-100">Matemática</span>
              </div>
              <div className="group p-5 rounded-xl bg-neutral-800/60 border border-white/5 border-l-info border-l-4 hover:border-white/10 transition-all cursor-default">
                <span className="text-2xl mb-3 block">⚡</span>
                <span className="text-sm font-semibold text-gray-100">Física</span>
              </div>
              <div className="group p-5 rounded-xl bg-neutral-800/60 border border-white/5 border-l-success border-l-4 hover:border-white/10 transition-all cursor-default">
                <span className="text-2xl mb-3 block">🧬</span>
                <span className="text-sm font-semibold text-gray-100">Biología</span>
              </div>
              <div className="group p-5 rounded-xl bg-neutral-800/60 border border-white/5 border-l-warning border-l-4 hover:border-white/10 transition-all cursor-default">
                <span className="text-2xl mb-3 block">⚗️</span>
                <span className="text-sm font-semibold text-gray-100">Química</span>
              </div>
              <div className="group p-5 rounded-xl bg-neutral-800/60 border border-white/5 border-l-error border-l-4 hover:border-white/10 transition-all cursor-default">
                <span className="text-2xl mb-3 block">📜</span>
                <span className="text-sm font-semibold text-gray-100">Historia</span>
              </div>
              <div className="group p-5 rounded-xl bg-neutral-800/60 border border-white/5 border-l-primary border-l-4 hover:border-white/10 transition-all cursor-default">
                <span className="text-2xl mb-3 block">📖</span>
                <span className="text-sm font-semibold text-gray-100">Lenguaje</span>
              </div>
              <div className="group p-5 rounded-xl bg-neutral-800/60 border border-white/5 border-l-warning border-l-4 hover:border-white/10 transition-all cursor-default">
                <span className="text-2xl mb-3 block">🏛️</span>
                <span className="text-sm font-semibold text-gray-100">Cívica</span>
              </div>
              <div className="group p-5 rounded-xl bg-neutral-800/60 border border-white/5 border-l-success border-l-4 hover:border-white/10 transition-all cursor-default">
                <span className="text-2xl mb-3 block">🗺️</span>
                <span className="text-sm font-semibold text-gray-100">Geografía</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ───────────────────────────────────────────────────── */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-800/30 to-neutral-900 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/[0.04] blur-[150px] rounded-full pointer-events-none" />

          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.25em] mb-6 block">¿Listo?</span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Tu vacante no va a <br />
              esperar <span className="text-primary">para siempre</span>
            </h2>
            <p className="text-xl text-[#9CA3AF] mb-12 max-w-xl mx-auto leading-relaxed">
              Únete a 1,200+ estudiantes que ya usan Combo UNSA para prepararse con inteligencia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/registro"
                className="group w-full sm:w-auto px-10 py-5 bg-primary text-neutral-900 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-yellow-600 transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5"
              >
                Crear cuenta gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="mt-6 text-sm text-[#8B949E] flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Gratis para siempre en plan básico. Sin letra pequeña.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
