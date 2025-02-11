-- This is an optional file containing test data for demo purposes.
  -- It will populate your tables with sample data when executed.
  -- Only use this in development/demo environments, not production.
  
  INSERT INTO "User" ("ID", "OAuthID", "UserName", "AvatarURL", "UserLevel") VALUES
(gen_random_uuid(), 'google_123456', 'john.doe', 'https://avatar.com/jd1.jpg', 'BASIC'),
(gen_random_uuid(), 'facebook_789012', 'jane.smith', 'https://avatar.com/js2.jpg', 'PREMIUM'),
(gen_random_uuid(), 'github_345678', 'mike.wilson', 'https://avatar.com/mw3.jpg', 'BASIC'),
(gen_random_uuid(), 'linkedin_901234', 'sarah.brown', 'https://avatar.com/sb4.jpg', 'PREMIUM'),
(gen_random_uuid(), 'google_567890', 'david.miller', 'https://avatar.com/dm5.jpg', 'BASIC'),
(gen_random_uuid(), 'facebook_123789', 'emma.davis', 'https://avatar.com/ed6.jpg', 'PREMIUM'),
(gen_random_uuid(), 'github_456012', 'chris.taylor', 'https://avatar.com/ct7.jpg', 'BASIC'),
(gen_random_uuid(), 'linkedin_234567', 'lisa.anderson', 'https://avatar.com/la8.jpg', 'PREMIUM'),
(gen_random_uuid(), 'google_890123', 'paul.martin', 'https://avatar.com/pm9.jpg', 'BASIC'),
(gen_random_uuid(), 'facebook_456789', 'amy.white', 'https://avatar.com/aw10.jpg', 'PREMIUM');

INSERT INTO "CompanyProfile" ("ID", "company_name", "company_description") VALUES
(gen_random_uuid(), 'Tech Solutions Inc', 'Leading software development company'),
(gen_random_uuid(), 'Global Industries', 'International manufacturing corporation'),
(gen_random_uuid(), 'Digital Dynamics', 'Digital marketing and consulting firm'),
(gen_random_uuid(), 'Innovate Corp', 'Innovation and technology solutions'),
(gen_random_uuid(), 'Future Systems', 'AI and machine learning specialists'),
(gen_random_uuid(), 'Green Energy Co', 'Renewable energy solutions provider'),
(gen_random_uuid(), 'Healthcare Plus', 'Healthcare technology solutions'),
(gen_random_uuid(), 'Finance Pro', 'Financial services and consulting'),
(gen_random_uuid(), 'Creative Media', 'Digital media and content creation'),
(gen_random_uuid(), 'Data Analytics Ltd', 'Big data and analytics solutions');

INSERT INTO "Category" ("ID", "category_name", "description") VALUES
(gen_random_uuid(), 'Software Development', 'Programming and software engineering positions'),
(gen_random_uuid(), 'Marketing', 'Digital and traditional marketing roles'),
(gen_random_uuid(), 'Finance', 'Financial and accounting positions'),
(gen_random_uuid(), 'Healthcare', 'Medical and healthcare related jobs'),
(gen_random_uuid(), 'Engineering', 'Various engineering disciplines'),
(gen_random_uuid(), 'Sales', 'Sales and business development roles'),
(gen_random_uuid(), 'Human Resources', 'HR and recruitment positions'),
(gen_random_uuid(), 'Design', 'Graphic and UX/UI design roles'),
(gen_random_uuid(), 'Operations', 'Operations and management positions'),
(gen_random_uuid(), 'Research', 'Research and development roles');

INSERT INTO "EmployerProfile" ("ID", "full_name", "CompanyProfileID") VALUES
(gen_random_uuid(), 'John Manager', (SELECT "ID" FROM "CompanyProfile" LIMIT 1)),
(gen_random_uuid(), 'Sarah Director', (SELECT "ID" FROM "CompanyProfile" OFFSET 1 LIMIT 1)),
(gen_random_uuid(), 'Michael Leader', (SELECT "ID" FROM "CompanyProfile" OFFSET 2 LIMIT 1)),
(gen_random_uuid(), 'Emily Boss', (SELECT "ID" FROM "CompanyProfile" OFFSET 3 LIMIT 1)),
(gen_random_uuid(), 'David Chief', (SELECT "ID" FROM "CompanyProfile" OFFSET 4 LIMIT 1)),
(gen_random_uuid(), 'Lisa Executive', (SELECT "ID" FROM "CompanyProfile" OFFSET 5 LIMIT 1)),
(gen_random_uuid(), 'Robert Head', (SELECT "ID" FROM "CompanyProfile" OFFSET 6 LIMIT 1)),
(gen_random_uuid(), 'Anna Principal', (SELECT "ID" FROM "CompanyProfile" OFFSET 7 LIMIT 1)),
(gen_random_uuid(), 'James Director', (SELECT "ID" FROM "CompanyProfile" OFFSET 8 LIMIT 1)),
(gen_random_uuid(), 'Patricia Lead', (SELECT "ID" FROM "CompanyProfile" OFFSET 9 LIMIT 1));

INSERT INTO "JobListing" ("ID", "job_title", "job_description", "EmployerProfileID", "CategoryID") VALUES
(gen_random_uuid(), 'Senior Developer', 'Senior developer position for web applications', (SELECT "ID" FROM "EmployerProfile" LIMIT 1), (SELECT "ID" FROM "Category" LIMIT 1)),
(gen_random_uuid(), 'Marketing Manager', 'Experienced marketing manager needed', (SELECT "ID" FROM "EmployerProfile" OFFSET 1 LIMIT 1), (SELECT "ID" FROM "Category" OFFSET 1 LIMIT 1)),
(gen_random_uuid(), 'Financial Analyst', 'Financial analyst position available', (SELECT "ID" FROM "EmployerProfile" OFFSET 2 LIMIT 1), (SELECT "ID" FROM "Category" OFFSET 2 LIMIT 1)),
(gen_random_uuid(), 'Healthcare Administrator', 'Healthcare admin role open', (SELECT "ID" FROM "EmployerProfile" OFFSET 3 LIMIT 1), (SELECT "ID" FROM "Category" OFFSET 3 LIMIT 1)),
(gen_random_uuid(), 'Mechanical Engineer', 'Engineering position for experienced professional', (SELECT "ID" FROM "EmployerProfile" OFFSET 4 LIMIT 1), (SELECT "ID" FROM "Category" OFFSET 4 LIMIT 1)),
(gen_random_uuid(), 'Sales Representative', 'Sales position with great benefits', (SELECT "ID" FROM "EmployerProfile" OFFSET 5 LIMIT 1), (SELECT "ID" FROM "Category" OFFSET 5 LIMIT 1)),
(gen_random_uuid(), 'HR Manager', 'Human resources manager needed', (SELECT "ID" FROM "EmployerProfile" OFFSET 6 LIMIT 1), (SELECT "ID" FROM "Category" OFFSET 6 LIMIT 1)),
(gen_random_uuid(), 'UX Designer', 'User experience designer position', (SELECT "ID" FROM "EmployerProfile" OFFSET 7 LIMIT 1), (SELECT "ID" FROM "Category" OFFSET 7 LIMIT 1)),
(gen_random_uuid(), 'Operations Manager', 'Operations management role', (SELECT "ID" FROM "EmployerProfile" OFFSET 8 LIMIT 1), (SELECT "ID" FROM "Category" OFFSET 8 LIMIT 1)),
(gen_random_uuid(), 'Research Scientist', 'Research position in R&D', (SELECT "ID" FROM "EmployerProfile" OFFSET 9 LIMIT 1), (SELECT "ID" FROM "Category" OFFSET 9 LIMIT 1));

INSERT INTO "UserSession" ("ID", "SessionToken", "UserID", "ExpirationDate") VALUES
(gen_random_uuid(), 'token123', (SELECT "ID" FROM "User" LIMIT 1), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token456', (SELECT "ID" FROM "User" OFFSET 1 LIMIT 1), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token789', (SELECT "ID" FROM "User" OFFSET 2 LIMIT 1), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token012', (SELECT "ID" FROM "User" OFFSET 3 LIMIT 1), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token345', (SELECT "ID" FROM "User" OFFSET 4 LIMIT 1), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token678', (SELECT "ID" FROM "User" OFFSET 5 LIMIT 1), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token901', (SELECT "ID" FROM "User" OFFSET 6 LIMIT 1), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token234', (SELECT "ID" FROM "User" OFFSET 7 LIMIT 1), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token567', (SELECT "ID" FROM "User" OFFSET 8 LIMIT 1), NOW() + INTERVAL '1 day'),
(gen_random_uuid(), 'token890', (SELECT "ID" FROM "User" OFFSET 9 LIMIT 1), NOW() + INTERVAL '1 day');

INSERT INTO "JobAlert" ("ID", "alert_name", "criteria", "UserID") VALUES
(gen_random_uuid(), 'Developer Jobs', 'javascript,python,web development', (SELECT "ID" FROM "User" LIMIT 1)),
(gen_random_uuid(), 'Marketing Positions', 'digital marketing,social media', (SELECT "ID" FROM "User" OFFSET 1 LIMIT 1)),
(gen_random_uuid(), 'Finance Jobs', 'accounting,analysis,banking', (SELECT "ID" FROM "User" OFFSET 2 LIMIT 1)),
(gen_random_uuid(), 'Healthcare Opportunities', 'medical,healthcare,nursing', (SELECT "ID" FROM "User" OFFSET 3 LIMIT 1)),
(gen_random_uuid(), 'Engineering Roles', 'mechanical,electrical,civil', (SELECT "ID" FROM "User" OFFSET 4 LIMIT 1)),
(gen_random_uuid(), 'Sales Positions', 'sales,business development', (SELECT "ID" FROM "User" OFFSET 5 LIMIT 1)),
(gen_random_uuid(), 'HR Jobs', 'human resources,recruitment', (SELECT "ID" FROM "User" OFFSET 6 LIMIT 1)),
(gen_random_uuid(), 'Design Opportunities', 'graphic design,UI/UX', (SELECT "ID" FROM "User" OFFSET 7 LIMIT 1)),
(gen_random_uuid(), 'Operations Roles', 'operations,management', (SELECT "ID" FROM "User" OFFSET 8 LIMIT 1)),
(gen_random_uuid(), 'Research Positions', 'research,development,science', (SELECT "ID" FROM "User" OFFSET 9 LIMIT 1));

INSERT INTO "ResumeDatabase" ("ID", "candidate_name", "resume_text", "UserID") VALUES
(gen_random_uuid(), 'John Doe', 'Experienced software developer with 5 years experience', (SELECT "ID" FROM "User" LIMIT 1)),
(gen_random_uuid(), 'Jane Smith', 'Marketing professional with digital expertise', (SELECT "ID" FROM "User" OFFSET 1 LIMIT 1)),
(gen_random_uuid(), 'Mike Wilson', 'Financial analyst with CPA certification', (SELECT "ID" FROM "User" OFFSET 2 LIMIT 1)),
(gen_random_uuid(), 'Sarah Brown', 'Healthcare administrator with MBA', (SELECT "ID" FROM "User" OFFSET 3 LIMIT 1)),
(gen_random_uuid(), 'David Miller', 'Mechanical engineer with patents', (SELECT "ID" FROM "User" OFFSET 4 LIMIT 1)),
(gen_random_uuid(), 'Emma Davis', 'Sales executive with proven track record', (SELECT "ID" FROM "User" OFFSET 5 LIMIT 1)),
(gen_random_uuid(), 'Chris Taylor', 'HR professional with SHRM certification', (SELECT "ID" FROM "User" OFFSET 6 LIMIT 1)),
(gen_random_uuid(), 'Lisa Anderson', 'UX designer with portfolio', (SELECT "ID" FROM "User" OFFSET 7 LIMIT 1)),
(gen_random_uuid(), 'Paul Martin', 'Operations manager with Six Sigma', (SELECT "ID" FROM "User" OFFSET 8 LIMIT 1)),
(gen_random_uuid(), 'Amy White', 'Research scientist with PhD', (SELECT "ID" FROM "User" OFFSET 9 LIMIT 1));

INSERT INTO "Contact" ("ID", "ContactName", "ContactEmail", "Message") VALUES
(gen_random_uuid(), 'John Doe', 'john@email.com', 'Inquiry about job posting'),
(gen_random_uuid(), 'Jane Smith', 'jane@email.com', 'Question about application'),
(gen_random_uuid(), 'Mike Wilson', 'mike@email.com', 'Technical support needed'),
(gen_random_uuid(), 'Sarah Brown', 'sarah@email.com', 'Account assistance'),
(gen_random_uuid(), 'David Miller', 'david@email.com', 'Feedback on platform'),
(gen_random_uuid(), 'Emma Davis', 'emma@email.com', 'Partnership inquiry'),
(gen_random_uuid(), 'Chris Taylor', 'chris@email.com', 'Resume help needed'),
(gen_random_uuid(), 'Lisa Anderson', 'lisa@email.com', 'Billing question'),
(gen_random_uuid(), 'Paul Martin', 'paul@email.com', 'Feature request'),
(gen_random_uuid(), 'Amy White', 'amy@email.com', 'General inquiry');

INSERT INTO "JobApplication" ("ID", "applicant_name", "JobListingID", "ResumeDatabaseID", "UserID") VALUES
(gen_random_uuid(), 'John Doe', (SELECT "ID" FROM "JobListing" LIMIT 1), (SELECT "ID" FROM "ResumeDatabase" LIMIT 1), (SELECT "ID" FROM "User" LIMIT 1)),
(gen_random_uuid(), 'Jane Smith', (SELECT "ID" FROM "JobListing" OFFSET 1 LIMIT 1), (SELECT "ID" FROM "ResumeDatabase" OFFSET 1 LIMIT 1), (SELECT "ID" FROM "User" OFFSET 1 LIMIT 1)),
(gen_random_uuid(), 'Mike Wilson', (SELECT "ID" FROM "JobListing" OFFSET 2 LIMIT 1), (SELECT "ID" FROM "ResumeDatabase" OFFSET 2 LIMIT 1), (SELECT "ID" FROM "User" OFFSET 2 LIMIT 1)),
(gen_random_uuid(), 'Sarah Brown', (SELECT "ID" FROM "JobListing" OFFSET 3 LIMIT 1), (SELECT "ID" FROM "ResumeDatabase" OFFSET 3 LIMIT 1), (SELECT "ID" FROM "User" OFFSET 3 LIMIT 1)),
(gen_random_uuid(), 'David Miller', (SELECT "ID" FROM "JobListing" OFFSET 4 LIMIT 1), (SELECT "ID" FROM "ResumeDatabase" OFFSET 4 LIMIT 1), (SELECT "ID" FROM "User" OFFSET 4 LIMIT 1)),
(gen_random_uuid(), 'Emma Davis', (SELECT "ID" FROM "JobListing" OFFSET 5 LIMIT 1), (SELECT "ID" FROM "ResumeDatabase" OFFSET 5 LIMIT 1), (SELECT "ID" FROM "User" OFFSET 5 LIMIT 1)),
(gen_random_uuid(), 'Chris Taylor', (SELECT "ID" FROM "JobListing" OFFSET 6 LIMIT 1), (SELECT "ID" FROM "ResumeDatabase" OFFSET 6 LIMIT 1), (SELECT "ID" FROM "User" OFFSET 6 LIMIT 1)),
(gen_random_uuid(), 'Lisa Anderson', (SELECT "ID" FROM "JobListing" OFFSET 7 LIMIT 1), (SELECT "ID" FROM "ResumeDatabase" OFFSET 7 LIMIT 1), (SELECT "ID" FROM "User" OFFSET 7 LIMIT 1)),
(gen_random_uuid(), 'Paul Martin', (SELECT "ID" FROM "JobListing" OFFSET 8 LIMIT 1), (SELECT "ID" FROM "ResumeDatabase" OFFSET 8 LIMIT 1), (SELECT "ID" FROM "User" OFFSET 8 LIMIT 1)),
(gen_random_uuid(), 'Amy White', (SELECT "ID" FROM "JobListing" OFFSET 9 LIMIT 1), (SELECT "ID" FROM "ResumeDatabase" OFFSET 9 LIMIT 1), (SELECT "ID" FROM "User" OFFSET 9 LIMIT 1));