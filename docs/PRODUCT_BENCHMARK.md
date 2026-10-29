# Product Benchmark and Reference Model

ABC Loan Management is **not a clone** of another lender platform. We use established products to validate workflows, vocabulary and operational controls, then implement an original ABC experience and architecture.

## Reference platforms

### Mifos X / Apache Fineract
Primary reference for lending-domain breadth and configurable financial products.

Patterns adopted:
- customer-centred account model;
- configurable loan products;
- repayment schedules and loan lifecycle states;
- permissions by role;
- accounting and reporting as first-class modules;
- explicit loan-product terms rather than hard-coded loan types.

Sources:
- https://mifos.org/shortcodes/features/
- https://github.com/openmf/web-app
- https://fineract.apache.org/

### Lendsqr
Primary reference for a modern African lender administration workflow.

Patterns adopted:
- navigation split into Customers, Back Office and Settings;
- dashboard metrics including active loans, outstanding balance and portfolio at risk;
- "needs your attention" operational queue;
- customer/KYC management;
- product-specific sequential approval workflows;
- disbursement transaction management;
- branches, team members, roles, permissions and audit logs.

Sources:
- https://docs.lendsqr.com/
- https://docs.lendsqr.com/signing-up-on-lendsqr/understanding-the-dashboard/
- https://docs.lendsqr.com/how-to-add-an-approval-workflow-to-a-loan-product/

### LoanPro
Reference for servicing after origination.

Patterns adopted:
- servicing and collections treated as a major lifecycle area;
- borrower self-service direction;
- configurable workflows and task queues;
- automated communications;
- collateral tracking;
- payoff/closure discipline;
- detailed operational reporting.

Sources:
- https://help.loanpro.io/servicing-and-collections
- https://help.loanpro.io/reporting

## ABC product model

The resulting product hierarchy is:

1. **Home** — portfolio health, PAR, work requiring attention, recent activity.
2. **Customers** — borrowers, requests, loans, KYC/documents, guarantors.
3. **Back Office** — products, approval workflows, disbursements, repayments, transactions, collections, accounting, reports and audit.
4. **Administration** — branches, team members, roles/permissions and organisation settings.
5. **Borrower experience** — self-service applications, schedules, payments, receipts and documents (later phase).

## ABC-specific differentiation

- Zambia-first mobile money and banking integrations while retaining international provider adapters.
- Both individual and business borrowers.
- Explainable credit decision support rather than opaque auto-approval.
- Internal financial-health profile distinct from any official credit-bureau score.
- Ledger-first money movement: completed financial events post balanced journals.
- Tenant isolation from the beginning so multiple lending companies can operate on the platform.
- EJ Businesses remains the platform owner; lender organisations can later receive their own customer-facing branding.

## Copying policy

We may inspect open-source software under its applicable licence and study public product documentation. We do not copy proprietary source code, trademarks, protected visual assets or a commercial product's interface pixel-for-pixel. ABC implementations should remain original and should be traceable to our own domain model and design system.
