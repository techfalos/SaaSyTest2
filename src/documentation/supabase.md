# Supabase Interface Documentation

## Overview
This document provides instructions on how to set up and use Supabase in your project. It includes details on configuring environment variables, running database migrations, and other important considerations for using Supabase.

---

## 1. Prerequisites

- **Node.js Installed**: Ensure you have Node.js version 14 or higher installed.
- **Supabase Installed**: Supabase should be installed and running on your machine or accessible through a network.

## 2. Environment Variables
Modify the variables in env.local file - be sure to copy this file to .env.local

## 3. Running Database Migrations
You can run the migrations locally using the following commands below, or copy the migrations SQL into the Supabase SQL Editor (recommended for non-technical users).

### 1. Install the Supabase CLI
To manage migrations, install the Supabase CLI tool:

```bash
npm install -g supabase
```

Verify installation:

```bash
supabase --version
```

### 2. Initialize Supabase in Your Project
Run the following command to initialize Supabase in your project:

```bash
supabase init
```

This creates a `supabase` folder in your project containing configuration files.

### 3. Generate a New Migration
Create a new migration by running:

```bash
supabase migration new migration_name
```

This command creates a new SQL migration file in `supabase/migrations/`.

### 4. Apply Migrations Locally
To apply migrations to your local database, use:

```bash
supabase db push
```

### 5. Deploy Migrations to Remote Database
Once your migrations are ready, deploy them to the remote Supabase database:

```bash
supabase db push --remote
```

### 6. Verify Migration Status
To check the status of your migrations, run:

```bash
supabase migration status
```

### 7. Reverting Migrations
If needed, you can revert a migration:

```bash
supabase migration revert migration_name
```

## 4. Storage
If you need object storage, you can use the Supabase Storage API. You will need to create a bucket with the appropriate permissions. 

### How to create a bucket
```bash
supabase storage create-bucket bucket_name
```

### Set an environment variable for the bucket name
```bash
export SUPABASE_BUCKET_NAME=bucket_name
```
