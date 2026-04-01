# F1-Prediction-Dashboard

A full-stack Next.js dashboard displaying ML-powered F1 race predictions, built on top of the [F1 ML Pipeline](https://github.com/Fahad-76/F1-Race-Predictor).

## Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## How It Works

The dashboard is a read-only frontend — it doesn't run any ML code. Predictions are generated separately by the ML pipeline and uploaded to Supabase, where this dashboard reads and displays them live.
```
predict.py runs locally → uploads to Supabase → dashboard updates instantly
```

## Pages

- **Home** — model overview and stats
- **Predictions** — latest race driver win %, podium %, and average finish position

## Setup

1. Clone the repo and install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_KEY=your_anon_key
```

3. Run the dev server:
```bash
npm run dev
```

## Updating Predictions

Predictions are managed by the ML pipeline repo. To update the dashboard with a new race, run `predict.py` with the correct `SEASON` and `ROUND` values — the live site updates automatically.

## Deployment

Deployed on Vercel with GitHub CI/CD. Every push to `main` triggers an automatic redeployment.
