CREATE TABLE IF NOT EXISTS "User" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "OAuthID" VARCHAR(255) NOT NULL,
  "UserName" VARCHAR(255) NOT NULL,
  "AvatarURL" VARCHAR(512) NOT NULL,
  "UserLevel" VARCHAR(255) NOT NULL
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


CREATE TABLE IF NOT EXISTS "Category" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "category_name" VARCHAR(255) NOT NULL DEFAULT 'null',
  "description" TEXT NULL DEFAULT 'null'
);
REVOKE ALL ON "Category" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "Category_category_name_idx" ON "Category" USING btree ("category_name");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "Category_description_idx" ON "Category" USING GiST ("description" gist_trgm_ops);


CREATE TABLE IF NOT EXISTS "CompanyProfile" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "company_name" VARCHAR(255) NOT NULL DEFAULT 'null',
  "company_description" TEXT NULL DEFAULT 'null'
);
REVOKE ALL ON "CompanyProfile" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "CompanyProfile_company_name_idx" ON "CompanyProfile" USING btree ("company_name");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "CompanyProfile_company_description_idx" ON "CompanyProfile" USING GiST ("company_description" gist_trgm_ops);


CREATE TABLE IF NOT EXISTS "EmployerProfile" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "full_name" VARCHAR(255) NOT NULL DEFAULT 'null',
  "CompanyProfileID" UUID NOT NULL,
  CONSTRAINT "EmployerProfile_CompanyProfileID_fkey" FOREIGN KEY ("CompanyProfileID") REFERENCES "CompanyProfile"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "EmployerProfile" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "EmployerProfile_full_name_idx" ON "EmployerProfile" USING btree ("full_name");


CREATE TABLE IF NOT EXISTS "JobAlert" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "alert_name" VARCHAR(255) NOT NULL DEFAULT 'null',
  "criteria" TEXT NULL DEFAULT 'null',
  "UserID" UUID NOT NULL,
  CONSTRAINT "JobAlert_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "JobAlert" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "JobAlert_alert_name_idx" ON "JobAlert" USING btree ("alert_name");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "JobAlert_criteria_idx" ON "JobAlert" USING GiST ("criteria" gist_trgm_ops);


CREATE TABLE IF NOT EXISTS "JobListing" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "job_title" VARCHAR(255) NOT NULL DEFAULT 'null',
  "job_description" TEXT NULL DEFAULT 'null',
  "EmployerProfileID" UUID NOT NULL,
  "CategoryID" UUID NOT NULL,
  CONSTRAINT "JobListing_EmployerProfileID_fkey" FOREIGN KEY ("EmployerProfileID") REFERENCES "EmployerProfile"("ID") ON DELETE CASCADE,
  CONSTRAINT "JobListing_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "JobListing" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "JobListing_job_title_idx" ON "JobListing" USING btree ("job_title");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "JobListing_job_description_idx" ON "JobListing" USING GiST ("job_description" gist_trgm_ops);


CREATE TABLE IF NOT EXISTS "ResumeDatabase" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "candidate_name" VARCHAR(255) NOT NULL DEFAULT 'null',
  "resume_text" TEXT NULL DEFAULT 'null',
  "UserID" UUID NOT NULL,
  CONSTRAINT "ResumeDatabase_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "ResumeDatabase" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "ResumeDatabase_candidate_name_idx" ON "ResumeDatabase" USING btree ("candidate_name");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "ResumeDatabase_resume_text_idx" ON "ResumeDatabase" USING GiST ("resume_text" gist_trgm_ops);


CREATE TABLE IF NOT EXISTS "JobApplication" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "applicant_name" VARCHAR(255) NOT NULL DEFAULT 'null',
  "JobListingID" UUID NOT NULL,
  "ResumeDatabaseID" UUID NOT NULL,
  "UserID" UUID NOT NULL,
  CONSTRAINT "JobApplication_JobListingID_fkey" FOREIGN KEY ("JobListingID") REFERENCES "JobListing"("ID") ON DELETE CASCADE,
  CONSTRAINT "JobApplication_ResumeDatabaseID_fkey" FOREIGN KEY ("ResumeDatabaseID") REFERENCES "ResumeDatabase"("ID") ON DELETE CASCADE,
  CONSTRAINT "JobApplication_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "JobApplication" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "JobApplication_applicant_name_idx" ON "JobApplication" USING btree ("applicant_name");


CREATE TABLE IF NOT EXISTS "Contact" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "ContactName" VARCHAR(255) NOT NULL,
  "ContactEmail" VARCHAR(255) NOT NULL,
  "Message" TEXT NOT NULL
);
REVOKE ALL ON "Contact" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "Contact_ContactName_idx" ON "Contact" USING btree ("ContactName");
CREATE INDEX IF NOT EXISTS "Contact_ContactEmail_idx" ON "Contact" USING btree ("ContactEmail");


