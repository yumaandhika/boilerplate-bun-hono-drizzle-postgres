CREATE TABLE IF NOT EXISTS "components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"type" varchar(50),
	"brand" varchar(256),
	"model" varchar(256),
	"release_date" timestamp,
	"specifications" jsonb,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
