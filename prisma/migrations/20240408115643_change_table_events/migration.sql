/*
  Warnings:

  - You are about to drop the column `event_Start` on the `events` table. All the data in the column will be lost.
  - Added the required column `event_start` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "event_Start",
ADD COLUMN     "event_start" TIMESTAMP(3) NOT NULL;
