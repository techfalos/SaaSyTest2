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


CREATE TABLE IF NOT EXISTS "CandidateProfile" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "full_name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "profile_summary" TEXT NULL,
  "UserID" UUID NOT NULL,
  CONSTRAINT "CandidateProfile_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "CandidateProfile" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "CandidateProfile_full_name_idx" ON "CandidateProfile" USING btree ("full_name");
CREATE INDEX IF NOT EXISTS "CandidateProfile_email_idx" ON "CandidateProfile" USING btree ("email");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "CandidateProfile_profile_summary_idx" ON "CandidateProfile" USING GiST ("profile_summary" gist_trgm_ops);


CREATE TABLE IF NOT EXISTS "EmployerProfile" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "company_name" VARCHAR(255) NOT NULL,
  "contact_email" VARCHAR(255) NOT NULL,
  "company_description" TEXT NULL,
  "UserID" UUID NOT NULL,
  CONSTRAINT "EmployerProfile_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "EmployerProfile" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "EmployerProfile_company_name_idx" ON "EmployerProfile" USING btree ("company_name");
CREATE INDEX IF NOT EXISTS "EmployerProfile_contact_email_idx" ON "EmployerProfile" USING btree ("contact_email");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "EmployerProfile_company_description_idx" ON "EmployerProfile" USING GiST ("company_description" gist_trgm_ops);


CREATE TABLE IF NOT EXISTS "JobCategory" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "category_name" VARCHAR(255) NOT NULL,
  "description" TEXT NULL
);
REVOKE ALL ON "JobCategory" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "JobCategory_category_name_idx" ON "JobCategory" USING btree ("category_name");


CREATE TABLE IF NOT EXISTS "JobLocation" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "location_name" VARCHAR(255) NOT NULL,
  "description" TEXT NULL
);
REVOKE ALL ON "JobLocation" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "JobLocation_location_name_idx" ON "JobLocation" USING btree ("location_name");


CREATE TABLE IF NOT EXISTS "JobPosting" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "job_title" VARCHAR(255) NOT NULL,
  "job_description" TEXT NOT NULL,
  "employment_type" VARCHAR(100) NOT NULL,
  "salary_range" VARCHAR(100) NULL,
  "date_posted" TIMESTAMP NOT NULL,
  "EmployerProfileID" UUID NOT NULL,
  "JobCategoryID" UUID NOT NULL,
  "JobLocationID" UUID NOT NULL,
  CONSTRAINT "JobPosting_EmployerProfileID_fkey" FOREIGN KEY ("EmployerProfileID") REFERENCES "EmployerProfile"("ID") ON DELETE CASCADE,
  CONSTRAINT "JobPosting_JobCategoryID_fkey" FOREIGN KEY ("JobCategoryID") REFERENCES "JobCategory"("ID") ON DELETE CASCADE,
  CONSTRAINT "JobPosting_JobLocationID_fkey" FOREIGN KEY ("JobLocationID") REFERENCES "JobLocation"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "JobPosting" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "JobPosting_job_title_idx" ON "JobPosting" USING btree ("job_title");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "JobPosting_job_description_idx" ON "JobPosting" USING GiST ("job_description" gist_trgm_ops);
CREATE INDEX IF NOT EXISTS "JobPosting_employment_type_idx" ON "JobPosting" USING btree ("employment_type");
CREATE INDEX IF NOT EXISTS "JobPosting_date_posted_idx" ON "JobPosting" USING btree ("date_posted");


CREATE TABLE IF NOT EXISTS "JobApplication" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "application_status" VARCHAR(50) NOT NULL DEFAULT 'pending',
  "cover_letter" TEXT NULL,
  "date_applied" TIMESTAMP NOT NULL,
  "CandidateProfileID" UUID NOT NULL,
  "JobPostingID" UUID NOT NULL,
  "UserID" UUID NOT NULL,
  CONSTRAINT "JobApplication_CandidateProfileID_fkey" FOREIGN KEY ("CandidateProfileID") REFERENCES "CandidateProfile"("ID") ON DELETE CASCADE,
  CONSTRAINT "JobApplication_JobPostingID_fkey" FOREIGN KEY ("JobPostingID") REFERENCES "JobPosting"("ID") ON DELETE CASCADE,
  CONSTRAINT "JobApplication_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "JobApplication" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "JobApplication_application_status_idx" ON "JobApplication" USING btree ("application_status");
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "JobApplication_cover_letter_idx" ON "JobApplication" USING GiST ("cover_letter" gist_trgm_ops);
CREATE INDEX IF NOT EXISTS "JobApplication_date_applied_idx" ON "JobApplication" USING btree ("date_applied");


CREATE TABLE IF NOT EXISTS "ResumeManagement" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "resume_title" VARCHAR(255) NOT NULL,
  "resume_file" BYTEA NOT NULL,
  "date_uploaded" TIMESTAMP NOT NULL,
  "CandidateProfileID" UUID NOT NULL,
  "UserID" UUID NOT NULL,
  CONSTRAINT "ResumeManagement_CandidateProfileID_fkey" FOREIGN KEY ("CandidateProfileID") REFERENCES "CandidateProfile"("ID") ON DELETE CASCADE,
  CONSTRAINT "ResumeManagement_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE
);
REVOKE ALL ON "ResumeManagement" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "ResumeManagement_resume_title_idx" ON "ResumeManagement" USING btree ("resume_title");
CREATE INDEX IF NOT EXISTS "ResumeManagement_date_uploaded_idx" ON "ResumeManagement" USING btree ("date_uploaded");


CREATE TABLE IF NOT EXISTS "Contact" (
  "ID" UUID NOT NULL PRIMARY KEY,
  "ContactName" VARCHAR(255) NOT NULL,
  "ContactEmail" VARCHAR(255) NOT NULL,
  "Message" TEXT NOT NULL
);
REVOKE ALL ON "Contact" FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS "Contact_ContactName_idx" ON "Contact" USING btree ("ContactName");
CREATE INDEX IF NOT EXISTS "Contact_ContactEmail_idx" ON "Contact" USING btree ("ContactEmail");


