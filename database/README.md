# Database designs

The running application uses SQLite through `node:sqlite` in `apps/api/src/server.mjs`. Tables and indexes are created on startup. See the root README for persistence and backup instructions.

`migrations/001_core_schema.sql` is the earlier Oracle schema design. It is retained as a reference for a future Oracle integration; running it does not connect the current app to Oracle. Do not apply it to a production database without a reviewed migration and data reconciliation plan.
