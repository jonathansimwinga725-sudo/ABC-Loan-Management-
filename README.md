# ABC Loan Management

A modern multi-tenant lending platform being developed under **EJ Businesses**.

## Run the dashboard in GitHub Codespaces

1. Open a Codespace on the `develop` branch.
2. In the terminal run:

```bash
git pull origin develop
npm install
npm run dev
```

3. When Codespaces detects port **3000**, choose **Open in Browser**.

The dashboard currently runs with demonstration data so the interface can be developed before Oracle is connected.

## Applications

- `apps/web` — Next.js lender/borrower web experience
- `apps/api` — TypeScript API and Oracle connection foundation
- `database` — Oracle SQL migrations
- `docs` — architecture, data model, roadmap and design system

## Database

The API requires Oracle configuration. Copy `.env.example` to `.env` when you are ready to run the API. Never commit real credentials.

## Current branch strategy

- `main` — stable baseline
- `develop` — active development

© EJ Businesses. All rights reserved.
