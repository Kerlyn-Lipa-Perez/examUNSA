export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        {/* El nombre tiene que ser una variable */}
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          Hola, Juan <span role="img" aria-label="wave">👋</span>
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="SIMULACROS HOY" value="02" highlight="/05" />
        <StatCard title="PUNTAJE PROMEDIO" value="842" highlight="pts" textHighlight="text-primary" />
        <StatCard title="FLASHCARDS PENDIENTES" value="47" />
        <StatCard title="RACHA" value="12" highlight="🔥" textHighlight="text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Takes 2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Flashcards pendientes */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Flashcards pendientes hoy</h2>
              <a href="/flashcards" className="text-sm text-tertiary hover:text-blue-400 font-medium">Ver más</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Flashcard subject="BIOLOGÍA" subjectColor="bg-success text-success bg-opacity-10" borderClass="border-l-success" sm2="4d" text="¿Cuál es el organelo encargado de la respiración celular?" />
              <Flashcard subject="FÍSICA" subjectColor="bg-info text-info bg-opacity-10" borderClass="border-l-info" sm2="1d" text="Definición de la Tercera Ley de Newton (Acción y Reacción)." />
              <Flashcard subject="HISTORIA" subjectColor="bg-error text-error bg-opacity-10" borderClass="border-l-error" sm2="Hoy" text="¿En qué año se proclamó la independencia del Perú?" />
            </div>
          </div>

          {/* Último simulacro */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Último simulacro</h2>
            <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border flex flex-col md:flex-row gap-8 items-center">
              {/* Circular Progress */}
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1E2532" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#D4A017" strokeWidth="10" strokeDasharray="283" strokeDashoffset="84.9" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-white">14<span className="text-sm text-gray-500 font-normal">/20</span></span>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Matemáticas Avanzada</h3>
                  <p className="text-gray-400 text-sm">
                    Finalizado hace 2 horas. Tu desempeño en Álgebra fue superior al 85% de los postulantes.
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="inline-flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded text-xs font-semibold text-gray-300 border border-neutral-border">
                    <span className="text-success text-sm">✓</span> 14 Correctas
                  </span>
                  <span className="inline-flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded text-xs font-semibold text-gray-300 border border-neutral-border">
                    <span className="text-error text-sm">×</span> 6 Incorrectas
                  </span>
                </div>
              </div>
              
              <div>
                <button className="bg-secondary hover:bg-opacity-80 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Revisar errores
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Takes 1/3 width) */}
        <div className="space-y-8">
          {/* Próximo Simulacro */}
          <div className="bg-[#241d08] rounded-2xl p-6 border border-primary/20">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-primary font-bold">Próximo simulacro</h3>
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="mb-6">
              <p className="text-white font-bold mb-1">Simulacro General Tipo A</p>
              <p className="text-gray-400 text-sm">Mañana, 08:30 AM</p>
            </div>
            <div className="bg-neutral-900/50 rounded-lg p-3 flex items-center gap-3 mb-6">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-300 text-sm">Duración: 180 min</span>
            </div>
            <button className="w-full bg-primary hover:bg-yellow-600 text-neutral-900 font-bold py-2.5 rounded-lg transition-colors">
              Agendar Recordatorio
            </button>
          </div>

          {/* Progreso por materia */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
            <h3 className="text-white font-bold mb-6">Progreso por materia</h3>
            <div className="space-y-6">
              <ProgressBar subject="BIOLOGÍA" percent={78} colorClass="bg-success" colorHex="#10B981" />
              <ProgressBar subject="MATEMÁTICAS" percent={62} colorClass="bg-info" colorHex="#3B82F6" />
              <ProgressBar subject="HISTORIA" percent={45} colorClass="bg-error" colorHex="#EF4444" />
              <ProgressBar subject="CÍVICA" percent={92} colorClass="bg-primary" colorHex="#D4A017" />
            </div>
            <div className="mt-8 text-center">
              <a href="/estadisticas" className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors">
                Ver reporte completo <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, highlight, textHighlight = "text-gray-500" }: { title: string, value: string, highlight?: string, textHighlight?: string }) {
  return (
    <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-border">
      <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-bold text-white ${textHighlight && textHighlight !== 'text-gray-500' ? textHighlight : ''}`}>{value}</span>
        {highlight && <span className={`text-sm ${textHighlight}`}>{highlight}</span>}
      </div>
    </div>
  );
}

function Flashcard({ subject, subjectColor, borderClass, sm2, text }: { subject: string, subjectColor: string, borderClass: string, sm2: string, text: string }) {
  return (
    <div className={`bg-neutral-800 rounded-xl p-5 border-l-4 ${borderClass} border-y border-r border-neutral-border h-40 flex flex-col`}>
      <div className="flex justify-between items-center mb-4">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${subjectColor}`}>
          {subject}
        </span>
        <span className="text-xs text-gray-500 font-medium">SM-2: {sm2}</span>
      </div>
      <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">
        {text}
      </p>
    </div>
  );
}

function ProgressBar({ subject, percent, colorClass, colorHex }: { subject: string, percent: number, colorClass: string, colorHex: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-300 tracking-wider">{subject}</span>
        <span className="text-xs font-medium" style={{ color: colorHex }}>{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
