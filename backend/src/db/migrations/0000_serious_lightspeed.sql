CREATE TABLE "app"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"Email" text NOT NULL,
	"password_hash" varchar(60) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_Email_unique" UNIQUE("Email")
);
