# ABC Loan Management

A working lending workspace under **EJ Businesses**, with company registration, isolated company data, borrower accounts, monthly loan products, approvals, disbursements, repayments, receipts, journals and reports. The application starts with an empty database, not fictional balances.

## Run in GitHub Codespaces

Use the `develop` branch and Node **22.13 or newer** (Node 24 recommended).

```bash
git pull origin develop
npm ci
npm run dev
```

Open forwarded port **3000** in your browser. Register your company and administrator account. Create a borrower and product, submit a loan request, approve it, record disbursement after money is paid out, then record repayments. `npm run dev` starts both the web app and API. Keep port 4000 private.

For an existing Codespace with Node 20, run `nvm install 24` and `nvm use 24`, or rebuild the dev container.

## Data and configuration

SQLite is created at `apps/api/data/abc.sqlite`. Data survives app restarts but **not deletion of the Codespace or disk**. Back up this database using SQLite's backup API before replacing the disk; never commit customer data. One API instance on persistent storage is supported. Oracle migration SQL remains in `database/migrations` as a future integration design and is **not** the running database.

Optional: copy `.env.example` to root `.env`. The launcher loads it. `COOKIE_SECURE=true` is required for an HTTPS deployment. `DATABASE_PATH` is resolved relative to the API workspace. `API_INTERNAL_URL` defaults to `http://127.0.0.1:4000` and is never exposed to the browser.

## Checks and production build

```bash
npm test
npm run typecheck
npm run build
npm start
```

`npm start` requires a completed web build. Tests exercise persisted registration, authentication, tenant boundaries, client permissions, loan lifecycle, repayment allocation, duplicate-payment retries and journal balancing, plus schedule rounding and month-end dates.

## Supported rules

- ZMW amounts are stored as integer ngwee. Annual rates have two decimal places; products support flat or reducing-balance interest and 1–120 monthly instalments.
- Product terms are copied onto loan requests. Disbursement creates the schedule; approval alone does not move cash.
- Repayments allocate to the oldest instalment's interest, then principal. Overpayments and duplicate disbursements are rejected. Payment request keys prevent retry duplication.
- Journals track principal receivable, cash and interest received. They use cash-basis interest recognition, not accrual accounting. Outstanding agreed balance includes future contractual interest.
- Company administrators manage their own company. Client logins can view only their linked borrower’s loans and receipts. Sessions last eight hours.
- KYC verification records a manual identity check. Collateral and guarantors are text records attached to the loan.
- Collection reminders open an SMS draft on a supported device; they are not sent automatically. Payments marked Bank transfer or Mobile money are manual records, not provider integrations.

## Remaining release work

This is a functional development release, **not a fully integrated production banking system**. Outstanding work includes password reset and password change, MFA, a shared production rate limiter, staff roles and maker/checker approval, branches, secure document storage, verified guarantor workflows, payment reversals and reconciliation, mobile-money and messaging providers, automated due-date reminders, Oracle integration, restore drills, deployment monitoring and independent financial/security review. No bank connection, SMS subscription or hosting account has been configured.

See `docs/ARCHITECTURE.md` and `docs/ROADMAP.md` for the implementation boundaries.

© EJ Businesses. All rights reserved.
