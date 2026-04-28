<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Database schema lives in another repo

This app talks to a Supabase Postgres whose schema is defined in `../../pomodoro-preview/locus-api` (absolute: `/Users/cippa/Desktop/fly/pomodoro-preview/locus-api`). Authoritative migrations are in `locus-api/supabase/migrations/`.

Before writing or reviewing any SQL here (table names, column names, RLS, views like `app.entitlements_v`), read the relevant migration in that repo. Do not infer column names from this codebase — drift between the consumer (here) and the schema (there) is the most likely cause of Postgres errors like `column "X" of relation "Y" does not exist` (42703).
