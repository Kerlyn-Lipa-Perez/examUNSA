/**
 * Materias canónicas del examen de admisión UNSA 2026.
 * Fuente de verdad compartida entre backend y frontend.
 *
 * Las 7 áreas que conforman el examen:
 * 1. Aptitud Académica (razonamiento verbal, matemático, lógico, comprensión lectora)
 * 2. Matemática (aritmética, álgebra, geometría, trigonometría)
 * 3. Ciencias Sociales (historia del Perú, geografía)
 * 4. Ciencia y Tecnología (química, biología, física)
 * 5. Persona y Familia (psicología, filosofía, educación cívica)
 * 6. Comunicación (lenguaje, literatura)
 * 7. Inglés (lectura, gramática)
 */
export const MATERIAS_VALIDAS = [
  'aptitud',
  'matematica',
  'ciencias-sociales',
  'ciencia-tecnologia',
  'persona-familia',
  'comunicacion',
  'ingles',
] as const;

export type Materia = (typeof MATERIAS_VALIDAS)[number];
