# Fix My Chess

Track your Chess.com puzzle habits and streaks in one dashboard.

This project uses Chess.com’s public API (PubAPI) to ingest:
- Puzzle Rush daily totals (for an automatic “activity streak”)

## Local setup

1. Install deps (from the project root `fix-my-chess`)
   - `npm install`
2. Create your env file
   - Copy `.env.example` to `.env.local`
3. Initialize the database
   - `npx prisma migrate dev --name init`

## Run dev server

- `npm run dev`

## Ingest + update data

Ingest reads from:
- `https://api.chess.com/pub/player/{username}/stats`

Then it stores a daily snapshot in the DB.

Trigger ingest while the server is running:
- `GET /api/ingest?username=hikaru`

The UI also has an “Ingest now” button.

## Notes on streak accuracy

“Puzzle Rush Activity Streak” is computed from your stored daily snapshots as consecutive days where the Puzzle Rush daily attempts counter increased.

For best accuracy, run ingest daily.

