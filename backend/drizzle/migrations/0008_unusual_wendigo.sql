CREATE TABLE IF NOT EXISTS "exam_questions" (
	"id" varchar(150) PRIMARY KEY NOT NULL,
	"area" varchar(20) NOT NULL,
	"materia" varchar(50),
	"pregunta" text NOT NULL,
	"alternativa_a" text,
	"alternativa_b" text,
	"alternativa_c" text,
	"alternativa_d" text,
	"alternativa_e" text,
	"respuesta_correcta" varchar(1) NOT NULL,
	"universidad" varchar(10) DEFAULT 'UNSA' NOT NULL,
	"tipo_examen" varchar(30),
	"anio" integer,
	"fase" varchar(10),
	"fuente_url" varchar(500),
	"fuente_archivo" varchar(200),
	"origen_archivo" varchar(200),
	"confianza_extraccion" real,
	"revisado_manual" boolean DEFAULT false,
	"figura_path" varchar(300),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_exam_questions_area" ON "exam_questions" ("area");