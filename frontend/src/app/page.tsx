export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-4">Combo UNSA</h1>
        <p className="text-xl mb-8">Prepárate para el examen de admisión con simulacros IA y flashcards</p>
        <div className="space-x-4">
          <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Ingresar</a>
          <a href="/register" className="px-6 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Registrarse</a>
        </div>
      </main>
    </div>
  );
}