-- CreateTable
CREATE TABLE "PuzzleRushSnapshot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "asOf" DATETIME NOT NULL,
    "attemptsTotal" INTEGER,
    "scoreTotal" INTEGER,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DailyPuzzleCheckin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "asOf" DATETIME NOT NULL,
    "solved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "PuzzleRushSnapshot_username_asOf_idx" ON "PuzzleRushSnapshot"("username", "asOf");

-- CreateIndex
CREATE UNIQUE INDEX "PuzzleRushSnapshot_username_asOf_key" ON "PuzzleRushSnapshot"("username", "asOf");

-- CreateIndex
CREATE INDEX "DailyPuzzleCheckin_username_asOf_idx" ON "DailyPuzzleCheckin"("username", "asOf");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPuzzleCheckin_username_asOf_key" ON "DailyPuzzleCheckin"("username", "asOf");
