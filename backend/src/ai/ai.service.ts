import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

const MATERIAS: Record<string, string> = {
	matematica:
		"álgebra, aritmética, geometría euclídea, trigonometría, estadística básica",
	fisica:
		"cinemática, dinámica newtoniana, trabajo y energía, termodinámica, óptica geométrica",
	quimica:
		"tabla periódica, enlace químico, estequiometría, química orgánica básica, soluciones",
	biologia:
		"célula y organelos, genética mendeliana, ecosistemas, fisiología humana, evolución",
	historia:
		"historia del Perú (prehispánico a república), historia universal, geografía del Perú",
	lenguaje:
		"comprensión lectora, gramática, ortografía, literatura peruana e hispanoamericana",
	razonamiento:
		"razonamiento verbal, razonamiento matemático, razonamiento lógico",
};

@Injectable()
export class AiService {
	private client: OpenAI;

	constructor(private config: ConfigService) {
		this.client = new OpenAI({ apiKey: this.config.get("OPENAI_API_KEY") });
	}

	async generarPreguntas(materia: string, cantidad = 20) {
		const subtemas = MATERIAS[materia] ?? materia;
		const prompt = `Eres un experto en el examen de admisión de la UNSA Arequipa, Perú.
						Genera ${cantidad} preguntas de opción múltiple sobre ${materia}.
						Temas a cubrir: ${subtemas}

						RESPONDE SOLO con JSON válido, sin texto adicional:
						{
						  "preguntas": [
						    {
						      "texto": "Enunciado de la pregunta",
						      "alternativas": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
						      "correcta": "B",
						      "explicacion": "Explicación breve de por qué B es correcta (máx 2 líneas)"
						    }
						  ]
						}

						Reglas estrictas:
						- Exactamente ${cantidad} preguntas
						- Solo UNA alternativa correcta por pregunta
						- Dificultad progresiva: primeras 5 fáciles, siguientes 10 medias, últimas 5 difíciles
						- Estilo UNSA real: problemas numéricos en matemática/física, definiciones en biología/historia
						- NO repitas preguntas similares en el mismo simulacro
						- La explicación debe ser educativa, no solo decir "porque sí"`;

		const resp = await this.client.chat.completions.create({
			model: "gpt-4o-mini",
			response_format: { type: "json_object" },
			messages: [{ role: "user", content: prompt }],
			temperature: 0.8,
		});

		const data = JSON.parse(resp.choices[0].message.content!);
		return data.preguntas as any[];
	}

	async generarFlashcards(tema: string, cantidad = 10) {
		const prompt = `Genera ${cantidad} flashcards para estudiar "${tema}" para el examen UNSA Arequipa.
						Responde SOLO con JSON:
						{"cards": [{"pregunta": "...", "respuesta": "..."}]}
						Reglas: preguntas concretas, respuestas cortas (máx 2 líneas), al estilo UNSA.`;

		const resp = await this.client.chat.completions.create({
			model: "gpt-4o-mini",
			response_format: { type: "json_object" },
			messages: [{ role: "user", content: prompt }],
		});

		const data = JSON.parse(resp.choices[0].message.content!);
		return data.cards as any[];
	}
}
