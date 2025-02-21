-- This is an optional file containing test data for demo purposes.
  -- It will populate your tables with sample data when executed.
  -- Only use this in development/demo environments, not production.
  
  INSERT INTO "User" ("ID", "OAuthID", "UserName", "AvatarURL", "UserLevel") VALUES
(gen_random_uuid(), 'google|123456', 'john_doe', 'https://avatars.com/john.jpg', 'CANDIDATE'),
(gen_random_uuid(), 'github|789012', 'jane_smith', 'https://avatars.com/jane.jpg', 'EMPLOYER'),
(gen_random_uuid(), 'linkedin|345678', 'bob_wilson', 'https://avatars.com/bob.jpg', 'CANDIDATE'),
(gen_random_uuid(), 'google|901234', 'sarah_jones', 'https://avatars.com/sarah.jpg', 'EMPLOYER'),
(gen_random_uuid(), 'github|567890', 'mike_brown', 'https://avatars.com/mike.jpg', 'CANDIDATE'),
(gen_random_uuid(), 'linkedin|112233', 'emily_white', 'https://avatars.com/emily.jpg', 'EMPLOYER'),
(gen_random_uuid(), 'google|445566', 'david_green', 'https://avatars.com/david.jpg', 'CANDIDATE'),
(gen_random_uuid(), 'github|778899', 'lisa_taylor', 'https://avatars.com/lisa.jpg', 'EMPLOYER'),
(gen_random_uuid(), 'linkedin|998877', 'tom_adams', 'https://avatars.com/tom.jpg', 'CANDIDATE'),
(gen_random_uuid(), 'google|665544', 'amy_miller', 'https://avatars.com/amy.jpg', 'EMPLOYER');

INSERT INTO "UserSession" ("ID", "SessionToken", "UserID", "ExpirationDate") VALUES
(gen_random_uuid(), 'token1', (SELECT "ID" FROM "User" LIMIT 1 OFFSET 0), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token2', (SELECT "ID" FROM "User" LIMIT 1 OFFSET 1), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token3', (SELECT "ID" FROM "User" LIMIT 1 OFFSET 2), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token4', (SELECT "ID" FROM "User" LIMIT 1 OFFSET 3), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token5', (SELECT "ID" FROM "User" LIMIT 1 OFFSET 4), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token6', (SELECT "ID" FROM "User" LIMIT 1 OFFSET 5), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token7', (SELECT "ID" FROM "User" LIMIT 1 OFFSET 6), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token8', (SELECT "ID" FROM "User" LIMIT 1 OFFSET 7), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token9', (SELECT "ID" FROM "User" LIMIT 1 OFFSET 8), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token10', (SELECT "ID" FROM "User" LIMIT 1 OFFSET 9), NOW() + INTERVAL '1 day');

INSERT INTO "CandidateProfile" ("ID", "full_name", "email", "profile_summary", "UserID") 
SELECT gen_random_uuid(), 
       CASE row_number() OVER ()
         WHEN 1 THEN 'John Doe'
         WHEN 2 THEN 'Bob Wilson'
         WHEN 3 THEN 'Mike Brown'
         WHEN 4 THEN 'David Green'
         WHEN 5 THEN 'Tom Adams'
       END,
       CASE row_number() OVER ()
         WHEN 1 THEN 'john@example.com'
         WHEN 2 THEN 'bob@example.com'
         WHEN 3 THEN 'mike@example.com'
         WHEN 4 THEN 'david@example.com'
         WHEN 5 THEN 'tom@example.com'
       END,
       'Experienced professional seeking new opportunities',
       "ID"
FROM "User"
WHERE "UserLevel" = 'CANDIDATE'
LIMIT 5;

INSERT INTO "EmployerProfile" ("ID", "company_name", "contact_email", "company_description", "UserID")
SELECT gen_random_uuid(),
       CASE row_number() OVER ()
         WHEN 1 THEN 'Tech Corp'
         WHEN 2 THEN 'Innovation Inc'
         WHEN 3 THEN 'Digital Solutions'
         WHEN 4 THEN 'Future Systems'
         WHEN 5 THEN 'Smart Tech'
       END,
       CASE row_number() OVER ()
         WHEN 1 THEN 'hr@techcorp.com'
         WHEN 2 THEN 'jobs@innovation.com'
         WHEN 3 THEN 'careers@digital.com'
         WHEN 4 THEN 'hr@future.com'
         WHEN 5 THEN 'jobs@smarttech.com'
       END,
       'Leading technology company',
       "ID"
FROM "User"
WHERE "UserLevel" = 'EMPLOYER'
LIMIT 5;

INSERT INTO "JobCategory" ("ID", "category_name", "description") VALUES
(gen_random_uuid(), 'Software Development', 'Programming and software engineering positions'),
(gen_random_uuid(), 'Data Science', 'Data analysis and machine learning roles'),
(gen_random_uuid(), 'DevOps', 'Infrastructure and deployment automation'),
(gen_random_uuid(), 'Product Management', 'Product development and strategy'),
(gen_random_uuid(), 'UX Design', 'User experience and interface design'),
(gen_random_uuid(), 'Marketing', 'Digital marketing and brand management'),
(gen_random_uuid(), 'Sales', 'Business development and sales roles'),
(gen_random_uuid(), 'Customer Support', 'Technical and customer service positions'),
(gen_random_uuid(), 'HR', 'Human resources and recruitment'),
(gen_random_uuid(), 'Finance', 'Financial analysis and accounting');

INSERT INTO "JobLocation" ("ID", "location_name", "description") VALUES
(gen_random_uuid(), 'New York', 'United States, East Coast'),
(gen_random_uuid(), 'San Francisco', 'United States, West Coast'),
(gen_random_uuid(), 'London', 'United Kingdom'),
(gen_random_uuid(), 'Berlin', 'Germany'),
(gen_random_uuid(), 'Singapore', 'Asia Pacific'),
(gen_random_uuid(), 'Remote', 'Work from anywhere'),
(gen_random_uuid(), 'Toronto', 'Canada'),
(gen_random_uuid(), 'Sydney', 'Australia'),
(gen_random_uuid(), 'Paris', 'France'),
(gen_random_uuid(), 'Tokyo', 'Japan');

INSERT INTO "JobPosting" ("ID", "job_title", "job_description", "employment_type", "salary_range", "date_posted", "EmployerProfileID", "JobCategoryID", "JobLocationID")
SELECT 
    gen_random_uuid(),
    'Software Engineer',
    'Looking for experienced software engineers',
    'Full-time',
    '$100,000 - $150,000',
    NOW() - (random() * interval '30 days'),
    (SELECT "ID" FROM "EmployerProfile" LIMIT 1),
    (SELECT "ID" FROM "JobCategory" WHERE "category_name" = 'Software Development'),
    (SELECT "ID" FROM "JobLocation" LIMIT 1)
FROM generate_series(1, 10);

INSERT INTO "JobApplication" ("ID", "application_status", "cover_letter", "date_applied", "CandidateProfileID", "JobPostingID", "UserID")
SELECT 
    gen_random_uuid(),
    'pending',
    'I am very interested in this position',
    NOW() - (random() * interval '15 days'),
    (SELECT "ID" FROM "CandidateProfile" LIMIT 1),
    (SELECT "ID" FROM "JobPosting" LIMIT 1),
    (SELECT "UserID" FROM "CandidateProfile" LIMIT 1)
FROM generate_series(1, 10);

INSERT INTO "ResumeManagement" ("ID", "resume_title", "resume_file", "date_uploaded", "CandidateProfileID", "UserID")
SELECT 
    gen_random_uuid(),
    'My Professional Resume',
    '\x89504E470D0A1A0A'::bytea,
    NOW() - (random() * interval '30 days'),
    "ID",
    "UserID"
FROM "CandidateProfile";

INSERT INTO "Contact" ("ID", "ContactName", "ContactEmail", "Message") VALUES
(gen_random_uuid(), 'Contact Person 1', 'contact1@example.com', 'Question about job posting'),
(gen_random_uuid(), 'Contact Person 2', 'contact2@example.com', 'Technical support needed'),
(gen_random_uuid(), 'Contact Person 3', 'contact3@example.com', 'Partnership inquiry'),
(gen_random_uuid(), 'Contact Person 4', 'contact4@example.com', 'General question'),
(gen_random_uuid(), 'Contact Person 5', 'contact5@example.com', 'Feedback submission'),
(gen_random_uuid(), 'Contact Person 6', 'contact6@example.com', 'Account issues'),
(gen_random_uuid(), 'Contact Person 7', 'contact7@example.com', 'Job application help'),
(gen_random_uuid(), 'Contact Person 8', 'contact8@example.com', 'Website feedback'),
(gen_random_uuid(), 'Contact Person 9', 'contact9@example.com', 'Bug report'),
(gen_random_uuid(), 'Contact Person 10', 'contact10@example.com', 'Feature request');