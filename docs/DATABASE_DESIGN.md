# Database Design Decisions

## Tenant isolation
All lender-owned aggregate roots carry `organisation_id`. Application services must obtain the tenant from the authenticated membership, never trust an organisation ID supplied by a client.

## Borrowers
A borrower is either an individual or business. The common `borrowers` record is extended one-to-one by the relevant subtype table. A borrower may optionally have an app user account for self-service login.

## Products
Products snapshot their financial terms onto the loan at origination. Changing a product later must not retroactively change existing loan contracts.

## Ledger
The ledger uses journals with one or more debit/credit entries. A posting service must verify that total debit equals total credit before commit. Posted journals are never edited or deleted; corrections use reversing journals.

## Payments
Payment records describe the payment rail and lifecycle. A payment is financially effective only when completed and linked to a balanced journal. Provider adapters will handle MTN MoMo, Airtel Money, Zamtel Money, banks and cards.

## IDs
Numeric identity columns are internal database keys. Public APIs will expose UUID-style `public_id` values instead of sequential primary keys.

## Money
Oracle `NUMBER(19,4)` is used for stored monetary values. Application code must use decimal-safe arithmetic; JavaScript floating-point values must not be used for authoritative financial calculations.

## Security
National IDs, KYC documents and other sensitive borrower data will receive field-level protection and restricted permissions in a later security migration. Passwords are never stored directly; only strong password hashes are persisted.
