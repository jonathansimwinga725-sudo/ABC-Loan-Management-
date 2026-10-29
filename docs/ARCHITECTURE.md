# Runtime architecture

The Next.js web app proxies same-origin `/api/*` calls to a Node HTTP service. The API binds to loopback by default; expose only the web port. The browser receives an HttpOnly, SameSite=Strict session cookie, with the Secure flag enabled through `COOKIE_SECURE`. Cross-origin mutations are rejected by the web proxy. No authentication token is stored in localStorage.

SQLite runs in WAL mode with foreign keys enabled. Companies, users, sessions, business records, payment request keys and audit events are persistent. Every record read and mutation uses the authenticated company ID; clients are separately limited to their linked borrower. Request fields never supply the effective company or role.

Mutations run inside `BEGIN IMMEDIATE` transactions. Loan status changes, repayments, journals and audit records commit or roll back together. Money uses integer ngwee; rate calculations round at each instalment and the final principal instalment clears residual rounding. Month-end due dates clamp to the last valid day. Loan terms are copied from the product before approval.

Disbursement debits principal receivable and credits cash. Repayments allocate oldest instalment first, interest then principal, debit cash and credit principal receivable / interest income. This is cash-basis recognition, not a statutory accrual ledger. No public endpoint edits or deletes payments or journals. Reversal support is pending.

Sessions contain random 256-bit tokens; only SHA-256 token hashes are stored. Passwords are salted and hashed with scrypt. Authentication attempts are limited in-process by API peer address (the local proxy); use a trusted proxy and a shared, per-client limiter before scaling. Password recovery and MFA remain pending.

Oracle migration files are a design reference only. The current API has no Oracle dependency. Use one Node API process and persistent disk. This development release requires additional operational and security controls before public commercial deployment; see README.
