CREATE TABLE "app"."images" (
	"id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"image_type" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."images" ADD CONSTRAINT "images_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "app"."users"("id") ON DELETE no action ON UPDATE no action;