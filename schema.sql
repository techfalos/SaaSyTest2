-- Database Migration
-- Generated at: 2025-09-22T13:59:43.204Z
-- Mode: Production
-- LOCAL_DEV_MODE: false

CREATE TABLE IF NOT EXISTS "Services" (
  "id" UUID PRIMARY KEY NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "description" TEXT NOT NULL,
  "duration" INTEGER NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "category" VARCHAR(100) NOT NULL,
  "benefits" TEXT,
  "service_image" TEXT,
  "available" BOOLEAN NOT NULL,
  "display_order" INTEGER
);
CREATE TABLE IF NOT EXISTS "Practitioners" (
  "id" UUID PRIMARY KEY NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "bio" TEXT NOT NULL,
  "specializations" TEXT,
  "certifications" TEXT,
  "experience_years" INTEGER,
  "profile_image" TEXT,
  "email" VARCHAR(255),
  "phone" VARCHAR(20),
  "available" BOOLEAN NOT NULL,
  "display_order" INTEGER
);
CREATE TABLE IF NOT EXISTS "Sessions" (
  "id" UUID PRIMARY KEY NOT NULL,
  "servicesid" UUID NOT NULL,
  "practitionersid" UUID NOT NULL,
  "session_date" DATE NOT NULL,
  "session_time" TIME NOT NULL,
  "duration" INTEGER NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "notes" TEXT,
  "price" DECIMAL(10,2) NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "completed_at" TIMESTAMP,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "Users" ("userid")
);
CREATE TABLE IF NOT EXISTS "SoundLibrary" (
  "id" UUID PRIMARY KEY NOT NULL,
  "title" VARCHAR(200) NOT NULL,
  "description" TEXT,
  "audio_file" TEXT NOT NULL,
  "category" VARCHAR(100) NOT NULL,
  "duration" INTEGER,
  "benefits" TEXT,
  "is_guided_meditation" BOOLEAN NOT NULL,
  "thumbnail_image" TEXT,
  "published" BOOLEAN NOT NULL,
  "display_order" INTEGER
);
CREATE TABLE IF NOT EXISTS "WellnessResources" (
  "id" UUID PRIMARY KEY NOT NULL,
  "title" VARCHAR(200) NOT NULL,
  "content" TEXT NOT NULL,
  "category" VARCHAR(100) NOT NULL,
  "author" VARCHAR(100),
  "published_date" DATE NOT NULL,
  "tags" VARCHAR(500),
  "featured_image" TEXT,
  "published" BOOLEAN NOT NULL,
  "featured" BOOLEAN NOT NULL,
  "display_order" INTEGER
);
CREATE TABLE IF NOT EXISTS "Testimonials" (
  "id" UUID PRIMARY KEY NOT NULL,
  "client_name" VARCHAR(100) NOT NULL,
  "content" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "service_name" VARCHAR(200),
  "date_given" DATE NOT NULL,
  "featured" BOOLEAN NOT NULL,
  "approved" BOOLEAN NOT NULL,
  "client_photo" TEXT,
  "display_order" INTEGER
);
CREATE TABLE IF NOT EXISTS "WellnessJournal" (
  "id" UUID PRIMARY KEY NOT NULL,
  "entry_date" DATE NOT NULL,
  "mood_rating" INTEGER,
  "energy_level" INTEGER,
  "stress_level" INTEGER,
  "sleep_quality" INTEGER,
  "notes" TEXT,
  "session_feedback" TEXT,
  "goals" TEXT,
  "created_at" TIMESTAMP NOT NULL,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "Users" ("userid")
);
