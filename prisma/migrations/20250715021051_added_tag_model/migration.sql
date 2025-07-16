/*
  Warnings:

  - You are about to drop the column `tag` on the `StudyGuide` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "StudyGuide_tag_idx";

-- AlterTable
ALTER TABLE "StudyGuide" DROP COLUMN "tag";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "studyGuideID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_userID_key" ON "Tag"("name", "userID");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_studyGuideID_fkey" FOREIGN KEY ("studyGuideID") REFERENCES "StudyGuide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
