CREATE TABLE IF NOT EXISTS "ranking_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"accion" varchar(50) NOT NULL,
	"rp_ganados" integer NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_ranking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_rp" integer DEFAULT 0 NOT NULL,
	"simulacros_completados" integer DEFAULT 0 NOT NULL,
	"racha_actual" integer DEFAULT 0 NOT NULL,
	"racha_maxima" integer DEFAULT 0 NOT NULL,
	"respuestas_correctas" integer DEFAULT 0 NOT NULL,
	"respuestas_totales" integer DEFAULT 0 NOT NULL,
	"flashcards_revisadas" integer DEFAULT 0 NOT NULL,
	"ultimo_simulacro_at" timestamp,
	"ultima_actividad_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ranking_log" ADD CONSTRAINT "ranking_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_ranking" ADD CONSTRAINT "user_ranking_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ranking_log_user_created" ON "ranking_log" ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ranking_log_created" ON "ranking_log" ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_user_ranking" ON "user_ranking" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ranking_total_rp" ON "user_ranking" ("total_rp");