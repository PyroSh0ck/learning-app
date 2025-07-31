import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { AuthenticateUser, CheckIfValid, CheckValidStudyGuide } from "@/lib/customFuncs";
import { FlashCard, PracticeQuestion, QuestionType, Video } from "@prisma/client";
import { NextAuthRequest, Session } from "next-auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const PrismaQuerier = async (
  method: string,
  studyMethod: string,
  studyGuideID: string,
  studySetID: string,
  studyMethodID: string,
  req: NextAuthRequest,
  query: URLSearchParams
) => {
    const body = method === "GET" ? null : await req.json();
  switch (method) {
    case "GET": {
      const limit = Number(query.get("limit"));
      const iteration = Number(query.get("iteration")) || 0;

      if (isNaN(limit) || limit > 50) {
        return NextResponse.json({ message: "Limit is invalid or exceeds 50." }, { status: 400 });
      }

      const skip = iteration * limit;
      if (studyMethod === "flashcard") {
        const count = await prisma.flashCard.count({ where: { flashCardSetID: studyMethodID } });
        if (skip > count) {
          return NextResponse.json({ message: "Iteration too high." }, { status: 400 });
        }

        const data = await prisma.flashCard.findMany({
          where: { flashCardSetID: studyMethodID },
          skip,
          take: limit
        });

        return NextResponse.json(data);
      }

      if (studyMethod === "video") {
        const count = await prisma.video.count({ where: { playlistID: studyMethodID } });
        if (skip > count) {
          return NextResponse.json({ message: "Iteration too high." }, { status: 400 });
        }

        const data = await prisma.video.findMany({
          where: { playlistID: studyMethodID },
          skip,
          take: limit
        });

        return NextResponse.json(data);
      }

      if (studyMethod === "practice") {
        const qType = query.get("type") as QuestionType | null;
        const count = await prisma.practiceQuestion.count({
          where: {
            practiceQuestionSetID: studyMethodID,
            ...(qType && { type: qType })
          }
        });

        if (skip > count) {
          return NextResponse.json({ message: "Iteration too high." }, { status: 400 });
        }

        const data = await prisma.practiceQuestion.findMany({
          where: {
            practiceQuestionSetID: studyMethodID,
            ...(qType && { type: qType })
          },
          skip,
          take: limit
        });

        return NextResponse.json(data);
      }

      break;
    }

    case "POST": {
      if (studyMethod === "flashcard") {
        const parsed = JSON.parse(body);
        const flashcards = parsed.map((item: FlashCard) => ({
          frontContent: item.frontContent,
          backContent: item.backContent,
          flashCardSetID: studyMethodID
        }));

        const result = await prisma.flashCard.createMany({ data: flashcards });
        return NextResponse.json(result);
      }

      if (studyMethod === "video") {
        const parsed = JSON.parse(body);
        const videos = parsed.map((item: Video) => ({
          name: item.name,
          url: item.url,
          playlistID: studyMethodID
        }));

        const result = await prisma.video.createMany({ data: videos });
        return NextResponse.json(result);
      }

      if (studyMethod === "practice") {
        const parsed = JSON.parse(body);
        const questions = parsed.map((item: PracticeQuestion) => ({
          question: item.question,
          answer: item.answer,
          options: item.options,
          type: item.type,
          practiceQuestionSetID: studyMethodID
        }));

        const result = await prisma.practiceQuestion.createMany({ data: questions });
        return NextResponse.json(result);
      }

      break;
    }

    case "PATCH": {
      const updatedItems: any[] = [];

      for (const item of body) {
        try {
          if (studyMethod === "flashcard") {
            const updated = await prisma.flashCard.update({
              where: { id: item.id },
              data: item
            });
            updatedItems.push(updated);
          } else if (studyMethod === "video") {
            const updated = await prisma.video.update({
              where: { id: item.id },
              data: item
            });
            updatedItems.push(updated);
          } else if (studyMethod === "practice") {
            const updated = await prisma.practiceQuestion.update({
              where: { id: item.id },
              data: item
            });
            updatedItems.push(updated);
          }
        } catch (err) {
          if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
            return NextResponse.json({ message: "Invalid ID. Item not found." }, { status: 400 });
          }
          return NextResponse.json({ message: "Update failed." }, { status: 500 });
        }
      }

      return NextResponse.json(updatedItems);
    }

    case "DELETE": {
      for (const item of body) {
        try {
          if (studyMethod === "flashcard") {
            await prisma.flashCard.delete({ where: { id: item.id } });
          } else if (studyMethod === "video") {
            await prisma.video.delete({ where: { id: item.id } });
          } else if (studyMethod === "practice") {
            await prisma.practiceQuestion.delete({ where: { id: item.id } });
          }
        } catch (err) {
          return NextResponse.json({ message: `Delete failed. ${err}` }, { status: 500 });
        }
      }

      return NextResponse.json({ message: "Items deleted." });
    }
  }
};

const NetworkTemplate = async (
  session: Session,
  req: NextAuthRequest,
  { params }: { params: Promise<{ studyGuideID: string; studySetID: string; studyMethodID: string }> },
  method: string
) => {
  const userID = AuthenticateUser(session);
  if (typeof userID !== "string") return userID;

  const { studyGuideID, studySetID, studyMethodID } = await params;
  const methodType = req.nextUrl.searchParams.get("method");

  const valid = CheckIfValid(studyGuideID, studySetID, studyMethodID, methodType);
  if (valid !== true) return valid;

  const studyGuide = await prisma.studyGuide.findUnique({ where: { id: studyGuideID } });
  const canAccess = CheckValidStudyGuide(studyGuide, userID);
  if (canAccess !== true) return canAccess;

  return PrismaQuerier(method, methodType!, studyGuideID, studySetID, studyMethodID, req, req.nextUrl.searchParams);
};
export const GET = auth(async function GET(req : NextAuthRequest, { params } : { params : Promise<{ studyGuideID : string, studySetID: string, studyMethodID: string } > }) {
    const session = req.auth;

    if (!session) {
        return NextResponse.json({ message: "Unauthorized: No session found." }, { status: 401 });
    }

    return NetworkTemplate(session, req, {params}, 'GET');
});

export const POST = auth(async function POST(req : NextAuthRequest, { params } : { params : Promise<{ studyGuideID : string, studySetID: string, studyMethodID: string } > }) {
    const session = req.auth;

    if (!session) {
        return NextResponse.json({ message: "Unauthorized: No session found." }, { status: 401 });
    }

    return NetworkTemplate(session, req, {params}, 'POST');
});

export const PATCH = auth(async function PATCH(req : NextAuthRequest, { params } : { params : Promise<{ studyGuideID : string, studySetID: string, studyMethodID: string } > }) {
    const session = req.auth;

    if (!session) {
        return NextResponse.json({ message: "Unauthorized: No session found." }, { status: 401 });
    }

    return NetworkTemplate(session, req, {params}, 'PATCH');
});

export const DELETE = auth(async function DELETE(req : NextAuthRequest, { params } : { params : Promise<{ studyGuideID : string, studySetID: string, studyMethodID: string } > }) {
    const session = req.auth;

    if (!session) {
        return NextResponse.json({ message: "Unauthorized: No session found." }, { status: 401 });
    }

    return NetworkTemplate(session, req, {params}, 'DELETE');
});
