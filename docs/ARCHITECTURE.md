# ABC Loan Management — Architecture

ABC Loan Management is a multi-tenant lending SaaS developed under EJ Businesses. Zambia is the first market, while country, currency and identity rules must remain configurable.

## Core principles

1. Tenant isolation: every lender-owned business record is scoped to an organisation.
2. API first: web and future mobile clients consume the same application API.
3. Ledger first: financial balances are derived from auditable transactions, never silently overwritten.
4. Configurable lending: loan products define interest method, rates, terms, fees and repayment frequency.
5. Security by default: least privilege, role-based access, audit events, secret isolation and validation.
6. Integration boundaries: mobile money, banks, bureaus, KYC and messaging connect through provider adapters.

## Initial modules

- Identity & authentication
- Organisations, branches, staff and roles
- Individual and business borrowers
- Loan products
- Applications and approvals
- Guarantors and collateral
- Loan accounts and repayment schedules
- Double-entry ledger
- Payments and reconciliation
- Arrears and collections
- Notifications
- Reporting and audit

## Tenant model

EJ Businesses operates the platform. Each lending company is an organisation (tenant). Staff memberships connect users to organisations and roles. Borrowers can authenticate through the platform while their lending relationships remain tenant-scoped.

## Financial integrity

Posted ledger entries are immutable. Corrections use reversals and new entries. Every journal must balance debits and credits. Monetary values use fixed-precision database numbers, never floating-point arithmetic.

## Planned clients

- Lender web application
- Borrower web application
- Platform administration
- Future native mobile clients
