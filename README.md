# Pawn Up

A Chess.com player dashboard: puzzle rush trends, activity streaks, ratings, clubs, tournaments, team matches, and live games—all backed by Chess.com’s public API.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| UI | [React](https://react.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |
| Data fetching / cache | [TanStack Query](https://tanstack.com/query) |
| Client state | [Zustand](https://zustand-demo.pmnd.rs/) |
| Charts | [Recharts](https://recharts.org/) |
| Chess logic | [chess.js](https://github.com/jhlywa/chess.js) |
| Database | [SQLite](https://www.sqlite.org/) via [Prisma](https://www.prisma.io/) |
| External API | [Chess.com PubAPI](https://www.chess.com/news/view/published-data-api) |

## Prerequisites

- [Node.js](https://nodejs.org/) (current LTS recommended)
- npm (bundled with Node)

## Setup

1. Clone the repository and install dependencies from the project root:

   ```bash
   npm install
   ```

2. Environment:

   ```bash
   cp .env.example .env.local
   ```

   `DATABASE_URL` defaults to a local SQLite file (`file:./dev.db`).

3. Create the database and apply migrations:

   ```bash
   npx prisma migrate dev
   ```

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server ([http://localhost:3000](http://localhost:3000)). |
| `npm run build` | Production build. |
| `npm run start` | Run the production server (after `npm run build`). |
| `npx prisma migrate dev` | Apply migrations in development; creates/updates the SQLite database. |
| `npx prisma generate` | Regenerate the Prisma Client (e.g. after schema changes). |
| `npx prisma studio` | Open a browser UI to inspect and edit database records. |

## Using the app

Enter a Chess.com username, then choose:

- **Load Player Stats** — Fetches live Chess.com data, saves today’s puzzle-rush snapshot for streak tracking, and refreshes charts and cards.
- **Refresh cached view** — Reloads the dashboard from stored data without a full PubAPI refresh.

## Puzzle rush streak

The **Puzzle Rush activity streak** uses daily snapshots stored in the database. A streak day is one where the puzzle-rush daily attempts counter increased compared to the previous stored day. For a streak that matches your real play, use **Load Player Stats** on days you puzzle—snapshots are written when that action runs.
