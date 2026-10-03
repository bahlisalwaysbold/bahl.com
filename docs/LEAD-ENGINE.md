# Bahl Lead Engine

The first configuration is Structural Detailing. The core can later power Bahl Studio, Bahl Digital and future services.

## Flow

Useful resource -> scope planner -> consented lead -> private file upload -> qualification score -> internal notification -> response reminder -> CRM stages -> quote -> won/lost -> revenue attribution.

## Routes

- /lead-engine — public structural detailing scope planner.
- /lead-engine/dashboard/login — private dashboard login.
- /lead-engine/dashboard — private lead pipeline.
- /api/lead-engine — lead intake and private file upload.
- /api/lead-engine/cron — internal response-reminder worker.

## Production environment

Set:

SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
CONTACT_FROM_EMAIL
CONTACT_TO_EMAIL
LEAD_DASHBOARD_PASSWORD
LEAD_DASHBOARD_SECRET
LEAD_ENGINE_CRON_SECRET
NEXT_PUBLIC_WHATSAPP_NUMBER

Never expose the Supabase service-role key or dashboard/cron secrets in client-side code.

## Setup

Run supabase/lead-engine.sql once in Supabase.

Add LEAD_ENGINE_CRON_SECRET to GitHub Actions secrets.

## Product rule

The planner estimates detailing scope and coordination load. It is not a structural design calculator or construction instruction. Final technical decisions stay with the responsible qualified engineer.

## Growth rule

Demand discovery may recommend opportunities for human review. Do not automatically spam or message strangers.

SEO pages should only be published when they contain meaningful, unique and useful Bahl-specific information.

## Commercial measurement

visitor -> tool_start -> tool_complete -> lead -> qualified -> contacted -> quote -> won/lost -> revenue

Optimize for revenue by source, not raw traffic.
