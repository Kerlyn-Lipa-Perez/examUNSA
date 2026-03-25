// frontend/src/data/exams/unsa/ordinario-i-2026-ingenierias.ts
// Examen Ordinario I Fase 2026 - Área Ingenierías
// Estructura de ejemplo con preguntas placeholder - llenar con contenido real

import { ExamData } from "@/types/simulacro";

const exam: ExamData = {
	meta: {
		id: "ordinario-i-2026",
		name: "Ordinario I Fase 2026",
		area: "ingenierias",
		university: "UNSA",
		totalPreguntas: 20,
		tiempoMinutos: 30,
		description:
			"Simulacro basado en el examen de admisión ordinario I fase 2026 - Ingenierías",
		year: 2026,
		fase: "I Fase",
	},
	preguntas: [
		// TODO: Agregar preguntas del área ingenierías
		{
			id: 1,
			materia: "Matemática",
			texto: "Si 2x + 3 = 11, ¿cuánto vale x²?",
			opciones: {
				A: "4",
				B: "9",
				C: "16",
				D: "25",
				E: "36",
			},
			respuestaCorrecta: "C",
		},
	],
};

export default exam;
