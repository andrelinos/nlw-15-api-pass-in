/*
  Warnings:

  - Made the column `event_Start` on table `events` required. This step will fail if there are existing NULL values in that column.
  - Made the column `event_finish` on table `events` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "event_Start" DATETIME NOT NULL,
    "event_finish" DATETIME NOT NULL,
    "maximum_attendees" INTEGER
);
INSERT INTO "new_events" ("details", "event_Start", "event_finish", "id", "maximum_attendees", "slug", "title") SELECT "details", "event_Start", "event_finish", "id", "maximum_attendees", "slug", "title" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
