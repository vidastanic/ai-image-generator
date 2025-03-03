ALTER TABLE "app"."images" DROP CONSTRAINT "images_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."images" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "app"."images" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "app"."images" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."images" ADD CONSTRAINT "images_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "app"."users"("id") ON DELETE no action ON UPDATE no action;