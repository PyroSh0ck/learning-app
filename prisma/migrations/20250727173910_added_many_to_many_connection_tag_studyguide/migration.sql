/*
  Warnings:

  - You are about to drop the column `StudySetID` on the `FlashCard` table. All the data in the column will be lost.
  - You are about to drop the column `StudySetID` on the `PracticeQuestion` table. All the data in the column will be lost.
  - The `options` column on the `PracticeQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `tag` on the `StudySet` table. All the data in the column will be lost.
  - You are about to drop the column `studyGuideID` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `StudySetID` on the `Video` table. All the data in the column will be lost.
  - Added the required column `flashCardSetID` to the `FlashCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `practiceQuestionSetID` to the `PracticeQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playlistID` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FlashCard" DROP CONSTRAINT "FlashCard_StudySetID_fkey";

-- DropForeignKey
ALTER TABLE "PracticeQuestion" DROP CONSTRAINT "PracticeQuestion_StudySetID_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_studyGuideID_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_StudySetID_fkey";

-- DropIndex
DROP INDEX "FlashCard_StudySetID_idx";

-- DropIndex
DROP INDEX "PracticeQuestion_StudySetID_idx";

-- DropIndex
DROP INDEX "StudySet_tag_idx";

-- DropIndex
DROP INDEX "Video_StudySetID_idx";

-- AlterTable
ALTER TABLE "FlashCard" DROP COLUMN "StudySetID",
ADD COLUMN     "flashCardSetID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PracticeQuestion" DROP COLUMN "StudySetID",
ADD COLUMN     "practiceQuestionSetID" TEXT NOT NULL,
DROP COLUMN "options",
ADD COLUMN     "options" TEXT[];

-- AlterTable
ALTER TABLE "StudyGuide" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "StudySet" DROP COLUMN "tag";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "studyGuideID";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "StudySetID",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "playlistID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FlashCardSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "studySetID" TEXT NOT NULL,

    CONSTRAINT "FlashCardSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "studySetID" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeQuestionSet" (
    "id" TEXT NOT NULL,
    "studySetID" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PracticeQuestionSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudyGuideTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StudyGuideTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Playlist_studySetID_idx" ON "Playlist"("studySetID");

-- CreateIndex
CREATE INDEX "PracticeQuestionSet_studySetID_idx" ON "PracticeQuestionSet"("studySetID");

-- CreateIndex
CREATE INDEX "_StudyGuideTags_B_index" ON "_StudyGuideTags"("B");

-- CreateIndex
CREATE INDEX "FlashCard_flashCardSetID_idx" ON "FlashCard"("flashCardSetID");

-- CreateIndex
CREATE INDEX "PracticeQuestion_practiceQuestionSetID_idx" ON "PracticeQuestion"("practiceQuestionSetID");

-- CreateIndex
CREATE INDEX "Video_playlistID_idx" ON "Video"("playlistID");

-- AddForeignKey
ALTER TABLE "FlashCardSet" ADD CONSTRAINT "FlashCardSet_studySetID_fkey" FOREIGN KEY ("studySetID") REFERENCES "StudySet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashCard" ADD CONSTRAINT "FlashCard_flashCardSetID_fkey" FOREIGN KEY ("flashCardSetID") REFERENCES "FlashCardSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_studySetID_fkey" FOREIGN KEY ("studySetID") REFERENCES "StudySet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_playlistID_fkey" FOREIGN KEY ("playlistID") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeQuestionSet" ADD CONSTRAINT "PracticeQuestionSet_studySetID_fkey" FOREIGN KEY ("studySetID") REFERENCES "StudySet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeQuestion" ADD CONSTRAINT "PracticeQuestion_practiceQuestionSetID_fkey" FOREIGN KEY ("practiceQuestionSetID") REFERENCES "PracticeQuestionSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudyGuideTags" ADD CONSTRAINT "_StudyGuideTags_A_fkey" FOREIGN KEY ("A") REFERENCES "StudyGuide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudyGuideTags" ADD CONSTRAINT "_StudyGuideTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
