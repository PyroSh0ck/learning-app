/*
  Warnings:

  - You are about to drop the column `flashCardSetID` on the `FlashCard` table. All the data in the column will be lost.
  - You are about to drop the column `flashCardSetID` on the `PracticeQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `flashCardSetID` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `FlashCardSet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `StudySetID` to the `FlashCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudySetID` to the `PracticeQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudySetID` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FlashCard" DROP CONSTRAINT "FlashCard_flashCardSetID_fkey";

-- DropForeignKey
ALTER TABLE "FlashCardSet" DROP CONSTRAINT "FlashCardSet_studyGuideID_fkey";

-- DropForeignKey
ALTER TABLE "PracticeQuestion" DROP CONSTRAINT "PracticeQuestion_flashCardSetID_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_flashCardSetID_fkey";

-- DropIndex
DROP INDEX "FlashCard_flashCardSetID_idx";

-- DropIndex
DROP INDEX "PracticeQuestion_flashCardSetID_idx";

-- DropIndex
DROP INDEX "Video_flashCardSetID_idx";

-- AlterTable
ALTER TABLE "FlashCard" DROP COLUMN "flashCardSetID",
ADD COLUMN     "StudySetID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PracticeQuestion" DROP COLUMN "flashCardSetID",
ADD COLUMN     "StudySetID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StudyGuide" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "flashCardSetID",
ADD COLUMN     "StudySetID" TEXT NOT NULL;

-- DropTable
DROP TABLE "FlashCardSet";

-- CreateTable
CREATE TABLE "StudySet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "studyGuideID" TEXT NOT NULL,

    CONSTRAINT "StudySet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudySet_tag_idx" ON "StudySet"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "StudySet_name_studyGuideID_key" ON "StudySet"("name", "studyGuideID");

-- CreateIndex
CREATE INDEX "FlashCard_StudySetID_idx" ON "FlashCard"("StudySetID");

-- CreateIndex
CREATE INDEX "PracticeQuestion_StudySetID_idx" ON "PracticeQuestion"("StudySetID");

-- CreateIndex
CREATE INDEX "Video_StudySetID_idx" ON "Video"("StudySetID");

-- AddForeignKey
ALTER TABLE "StudySet" ADD CONSTRAINT "StudySet_studyGuideID_fkey" FOREIGN KEY ("studyGuideID") REFERENCES "StudyGuide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashCard" ADD CONSTRAINT "FlashCard_StudySetID_fkey" FOREIGN KEY ("StudySetID") REFERENCES "StudySet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_StudySetID_fkey" FOREIGN KEY ("StudySetID") REFERENCES "StudySet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeQuestion" ADD CONSTRAINT "PracticeQuestion_StudySetID_fkey" FOREIGN KEY ("StudySetID") REFERENCES "StudySet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
