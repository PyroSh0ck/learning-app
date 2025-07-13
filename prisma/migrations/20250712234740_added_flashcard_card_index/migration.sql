/*
  Warnings:

  - You are about to drop the column `subject` on the `StudyGuide` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,studyGuideID]` on the table `FlashCardSet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userID]` on the table `StudyGuide` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cardIndex` to the `FlashCard` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FlashCardSet_name_tag_studyGuideID_idx";

-- DropIndex
DROP INDEX "FlashCardSet_studyGuideID_name_key";

-- DropIndex
DROP INDEX "StudyGuide_completed_subject_name_userID_idx";

-- DropIndex
DROP INDEX "StudyGuide_userID_name_key";

-- DropIndex
DROP INDEX "User_email_username_idx";

-- AlterTable
ALTER TABLE "FlashCard" ADD COLUMN     "cardIndex" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StudyGuide" DROP COLUMN "subject",
ADD COLUMN     "tag" TEXT;

-- CreateIndex
CREATE INDEX "FlashCardSet_tag_idx" ON "FlashCardSet"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "FlashCardSet_name_studyGuideID_key" ON "FlashCardSet"("name", "studyGuideID");

-- CreateIndex
CREATE INDEX "StudyGuide_completed_idx" ON "StudyGuide"("completed");

-- CreateIndex
CREATE INDEX "StudyGuide_tag_idx" ON "StudyGuide"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "StudyGuide_name_userID_key" ON "StudyGuide"("name", "userID");
