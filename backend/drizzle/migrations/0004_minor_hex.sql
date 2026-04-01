CREATE INDEX IF NOT EXISTS "idx_progress_user_revision" ON "flashcard_progress" ("user_id","proxima_revision");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_flashcard_user" ON "flashcards" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pago_user_created" ON "pagos" ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pago_referencia" ON "pagos" ("referencia");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_simulacro_user_created" ON "simulacro_results" ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_simulacro_user_exam" ON "simulacro_results" ("user_id","exam_id");