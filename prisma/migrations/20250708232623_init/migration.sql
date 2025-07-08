-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('writtenResponse', 'multipleChoice', 'multipleSelect');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyGuide" (
    "id" TEXT NOT NULL,
    "subject" TEXT,
    "name" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModifed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT NOT NULL,

    CONSTRAINT "StudyGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashCardSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModifed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studyGuideID" TEXT NOT NULL,

    CONSTRAINT "FlashCardSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashCard" (
    "id" TEXT NOT NULL,
    "frontContent" TEXT NOT NULL,
    "backContent" TEXT NOT NULL,
    "flashCardSetID" TEXT NOT NULL,
    "learnedCount" INTEGER NOT NULL DEFAULT 0,
    "lastLearned" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "FlashCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "flashCardSetID" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watched" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeQuestion" (
    "id" TEXT NOT NULL,
    "flashCardSetID" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT[],
    "options" TEXT[],
    "timesAnsweredRight" INTEGER NOT NULL DEFAULT 0,
    "timesAnsweredWrong" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "type" "QuestionType" NOT NULL DEFAULT 'writtenResponse',

    CONSTRAINT "PracticeQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_username_idx" ON "User"("email", "username");

-- CreateIndex
CREATE UNIQUE INDEX "StudyGuide_name_key" ON "StudyGuide"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FlashCardSet_name_key" ON "FlashCardSet"("name");

-- AddForeignKey
ALTER TABLE "StudyGuide" ADD CONSTRAINT "StudyGuide_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashCardSet" ADD CONSTRAINT "FlashCardSet_studyGuideID_fkey" FOREIGN KEY ("studyGuideID") REFERENCES "StudyGuide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashCard" ADD CONSTRAINT "FlashCard_flashCardSetID_fkey" FOREIGN KEY ("flashCardSetID") REFERENCES "FlashCardSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_flashCardSetID_fkey" FOREIGN KEY ("flashCardSetID") REFERENCES "FlashCardSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeQuestion" ADD CONSTRAINT "PracticeQuestion_flashCardSetID_fkey" FOREIGN KEY ("flashCardSetID") REFERENCES "FlashCardSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
