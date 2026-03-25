// frontend/src/data/exams/unsa/ordinario-i-2026-biomedicas.ts
import { ExamData } from '@/types/simulacro';

const exam: ExamData = {
	meta: {
		id: "ordinario-i-2026",
		name: "Ordinario I Fase 2026",
		area: "biomedicas",
		university: "UNSA",
		totalPreguntas: 20,
		tiempoMinutos: 30,
		description:
			"Simulacro basado en el examen de admisión ordinario I fase 2026 - Biomédicas",
		year: 2026,
		fase: "I Fase",
	},
	preguntas: [
		// TODO: Agregar preguntas del área biomédicas
		{
			id: 1,
			materia: "Razonamiento verbal",
			texto: 'Complete el siguiente texto: "Yo soy un cóndor que... sobre ti camiante. Y de promto te... con mis garras enormes. Y te ... ansioso en mi helado nido de nieve" ',
			opciones: {
				A: "planeo / asusta / pica",
				B: "canta / elevo / beso",
				C: "vuela / sigo / beso",
				D: "vuela / sigo / arrebato",
				E: "vuela / alzo / destrozo",
			},
			respuestaCorrecta: "E",
		},
	],
};

export default exam;
