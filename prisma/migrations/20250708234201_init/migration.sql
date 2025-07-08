/*
  Warnings:

  - You are about to drop the column `lastModifed` on the `FlashCardSet` table. All the data in the column will be lost.
  - The `options` column on the `PracticeQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `lastModifed` on the `StudyGuide` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studyGuideID,name]` on the table `FlashCardSet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID,name]` on the table `StudyGuide` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastModified` to the `FlashCardSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastModified` to the `StudyGuide` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FlashCardSet_name_key";

-- DropIndex
DROP INDEX "StudyGuide_name_key";

-- AlterTable
ALTER TABLE "FlashCardSet" DROP COLUMN "lastModifed",
ADD COLUMN     "lastModified" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PracticeQuestion" DROP COLUMN "options",
ADD COLUMN     "options" JSONB;

-- AlterTable
ALTER TABLE "StudyGuide" DROP COLUMN "lastModifed",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completedBy" TIMESTAMP(3),
ADD COLUMN     "lastModified" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "FlashCard_flashCardSetID_idx" ON "FlashCard"("flashCardSetID");

-- CreateIndex
CREATE INDEX "FlashCardSet_name_tag_studyGuideID_idx" ON "FlashCardSet"("name", "tag", "studyGuideID");

-- CreateIndex
CREATE UNIQUE INDEX "FlashCardSet_studyGuideID_name_key" ON "FlashCardSet"("studyGuideID", "name");

-- CreateIndex
CREATE INDEX "PracticeQuestion_flashCardSetID_idx" ON "PracticeQuestion"("flashCardSetID");

-- CreateIndex
CREATE INDEX "StudyGuide_completed_subject_name_userID_idx" ON "StudyGuide"("completed", "subject", "name", "userID");

-- CreateIndex
CREATE UNIQUE INDEX "StudyGuide_userID_name_key" ON "StudyGuide"("userID", "name");

-- CreateIndex
CREATE INDEX "Video_flashCardSetID_idx" ON "Video"("flashCardSetID");
