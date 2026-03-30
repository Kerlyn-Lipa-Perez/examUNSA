CREATE TABLE IF NOT EXISTS "pagos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"monto" integer NOT NULL,
	"moneda" varchar(3) DEFAULT 'PEN' NOT NULL,
	"estado" varchar(20) DEFAULT 'completado' NOT NULL,
	"plan_id" varchar(20) NOT NULL,
	"referencia" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pagos" ADD CONSTRAINT "pagos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
