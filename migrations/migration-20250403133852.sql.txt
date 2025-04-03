CREATE TABLE IF NOT EXISTS "User" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "OAuthID" VARCHAR(255) NOT NULL,
  "UserName" VARCHAR(255) NOT NULL,
  "AvatarURL" VARCHAR(512) NOT NULL,
  "UserLevel" VARCHAR(255) NOT NULL,
  "IsAdmin" BOOLEAN NOT NULL
);
REVOKE ALL ON "User" FROM anon, authenticated;



CREATE TABLE IF NOT EXISTS "UserSession" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "SessionToken" VARCHAR NOT NULL,
  "UserID" UUID NOT NULL,
  "ExpirationDate" TIMESTAMP NOT NULL,
  CONSTRAINT "UserSession_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "UserSession" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "UserSession_SessionToken_idx" ON "UserSession" USING btree ("SessionToken");


CREATE TABLE IF NOT EXISTS "MemberLocations" (
  "ID" UUID NOT NULL,
  "MembersID" UUID NOT NULL,
  "LocationsID" UUID NOT NULL,
  "ownership_type" VARCHAR(50) NOT NULL,
  "ownership_start_date" DATE NOT NULL,
  "notes" TEXT NULL,
  "UserID" UUID NOT NULL,
  CONSTRAINT "MemberLocations_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "MemberLocations" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "MemberLocations_ownership_type_idx" ON "MemberLocations" USING btree ("ownership_type");
CREATE INDEX IF NOT EXISTS "MemberLocations_ownership_start_date_idx" ON "MemberLocations" USING btree ("ownership_start_date");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "MemberLocations_notes_idx" ON "MemberLocations" USING GiST ("notes" gist_trgm_ops);


CREATE TABLE IF NOT EXISTS "Contact" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "ContactName" VARCHAR(255) NOT NULL,
  "ContactEmail" VARCHAR(255) NOT NULL,
  "Message" TEXT NOT NULL
);
REVOKE ALL ON "Contact" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "Contact_ContactName_idx" ON "Contact" USING btree ("ContactName");
CREATE INDEX IF NOT EXISTS "Contact_ContactEmail_idx" ON "Contact" USING btree ("ContactEmail");


CREATE TABLE IF NOT EXISTS "LocationImages" (
  "ID" UUID NOT NULL,
  "LocationsID" UUID NOT NULL,
  "image" TEXT NOT NULL,
  "caption" VARCHAR(200) NULL
);
REVOKE ALL ON "LocationImages" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "LocationImages_caption_idx" ON "LocationImages" USING btree ("caption");


CREATE TABLE IF NOT EXISTS "Locations" (
  "ID" UUID NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT NOT NULL,
  "address" VARCHAR(200) NOT NULL,
  "city" VARCHAR(50) NOT NULL,
  "state" VARCHAR(50) NOT NULL,
  "zip" VARCHAR(20) NOT NULL,
  "latitude" REAL NOT NULL,
  "longitude" REAL NOT NULL,
  "LocationCategoriesID" UUID NOT NULL,
  "website" VARCHAR(200) NULL,
  "phone" VARCHAR(20) NULL,
  "hours" TEXT NULL
);
REVOKE ALL ON "Locations" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "Locations_name_idx" ON "Locations" USING btree ("name");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "Locations_description_idx" ON "Locations" USING GiST ("description" gist_trgm_ops);
CREATE INDEX IF NOT EXISTS "Locations_address_idx" ON "Locations" USING btree ("address");
CREATE INDEX IF NOT EXISTS "Locations_city_idx" ON "Locations" USING btree ("city");
CREATE INDEX IF NOT EXISTS "Locations_state_idx" ON "Locations" USING btree ("state");
CREATE INDEX IF NOT EXISTS "Locations_zip_idx" ON "Locations" USING btree ("zip");
CREATE INDEX IF NOT EXISTS "Locations_latitude_idx" ON "Locations" USING btree ("latitude");
CREATE INDEX IF NOT EXISTS "Locations_longitude_idx" ON "Locations" USING btree ("longitude");
CREATE INDEX IF NOT EXISTS "Locations_website_idx" ON "Locations" USING btree ("website");
CREATE INDEX IF NOT EXISTS "Locations_phone_idx" ON "Locations" USING btree ("phone");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "Locations_hours_idx" ON "Locations" USING GiST ("hours" gist_trgm_ops);


CREATE TABLE IF NOT EXISTS "LocationCategories" (
  "ID" UUID NOT NULL,
  "name" VARCHAR(50) NOT NULL,
  "description" TEXT NOT NULL
);
REVOKE ALL ON "LocationCategories" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "LocationCategories_name_idx" ON "LocationCategories" USING btree ("name");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "LocationCategories_description_idx" ON "LocationCategories" USING GiST ("description" gist_trgm_ops);


CREATE TABLE IF NOT EXISTS "EventRegistrations" (
  "ID" UUID NOT NULL,
  "EventsID" UUID NOT NULL,
  "MembersID" UUID NOT NULL,
  "registration_date" TIMESTAMP NOT NULL,
  "status" VARCHAR(20) NOT NULL,
  "UserID" UUID NOT NULL,
  CONSTRAINT "EventRegistrations_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "EventRegistrations" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "EventRegistrations_registration_date_idx" ON "EventRegistrations" USING btree ("registration_date");
CREATE INDEX IF NOT EXISTS "EventRegistrations_status_idx" ON "EventRegistrations" USING btree ("status");


CREATE TABLE IF NOT EXISTS "Events" (
  "ID" UUID NOT NULL,
  "title" VARCHAR(100) NOT NULL,
  "description" TEXT NOT NULL,
  "start_date" TIMESTAMP NOT NULL,
  "end_date" TIMESTAMP NOT NULL,
  "location" VARCHAR(200) NOT NULL,
  "event_type" VARCHAR(50) NOT NULL,
  "event_image" TEXT NULL
);
REVOKE ALL ON "Events" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "Events_title_idx" ON "Events" USING btree ("title");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "Events_description_idx" ON "Events" USING GiST ("description" gist_trgm_ops);
CREATE INDEX IF NOT EXISTS "Events_start_date_idx" ON "Events" USING btree ("start_date");
CREATE INDEX IF NOT EXISTS "Events_end_date_idx" ON "Events" USING btree ("end_date");
CREATE INDEX IF NOT EXISTS "Events_location_idx" ON "Events" USING btree ("location");
CREATE INDEX IF NOT EXISTS "Events_event_type_idx" ON "Events" USING btree ("event_type");


CREATE TABLE IF NOT EXISTS "Members" (
  "ID" UUID NOT NULL,
  "first_name" VARCHAR(50) NOT NULL,
  "last_name" VARCHAR(50) NOT NULL,
  "email" VARCHAR(100) NOT NULL,
  "phone" VARCHAR(20) NULL,
  "address" VARCHAR(200) NULL,
  "city" VARCHAR(50) NULL,
  "state" VARCHAR(50) NULL,
  "zip" VARCHAR(20) NULL,
  "membership_type" VARCHAR(50) NOT NULL,
  "joined_date" DATE NOT NULL,
  "expiration_date" DATE NOT NULL,
  "profile_image" TEXT NULL,
  "UserID" UUID NOT NULL,
  CONSTRAINT "Members_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "Members" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "Members_first_name_idx" ON "Members" USING btree ("first_name");
CREATE INDEX IF NOT EXISTS "Members_last_name_idx" ON "Members" USING btree ("last_name");
CREATE INDEX IF NOT EXISTS "Members_email_idx" ON "Members" USING btree ("email");
CREATE INDEX IF NOT EXISTS "Members_phone_idx" ON "Members" USING btree ("phone");
CREATE INDEX IF NOT EXISTS "Members_address_idx" ON "Members" USING btree ("address");
CREATE INDEX IF NOT EXISTS "Members_city_idx" ON "Members" USING btree ("city");
CREATE INDEX IF NOT EXISTS "Members_state_idx" ON "Members" USING btree ("state");
CREATE INDEX IF NOT EXISTS "Members_zip_idx" ON "Members" USING btree ("zip");
CREATE INDEX IF NOT EXISTS "Members_membership_type_idx" ON "Members" USING btree ("membership_type");
CREATE INDEX IF NOT EXISTS "Members_joined_date_idx" ON "Members" USING btree ("joined_date");
CREATE INDEX IF NOT EXISTS "Members_expiration_date_idx" ON "Members" USING btree ("expiration_date");


