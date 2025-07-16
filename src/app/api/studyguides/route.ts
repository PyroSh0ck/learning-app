import { prisma } from '@/lib/db'
import { StudyGuide } from '@prisma/client'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { studyGuideName, tags } = body;

  if (!studyGuideName || studyGuideName.trim() === "") {
    return NextResponse.json({
      message: "Studyguide was unable to be saved. No name was sent.",
      status: 500,
    });
  }

  try {
    const data = {
      name: studyGuideName.trim(),
      userID: "abc1",
      ...(tags?.trim() ? { tag: tags.trim() } : {}),
    };

    await prisma.studyGuide.create({ data });

    return NextResponse.json({
      message: "Saved Studyguide!",
      status: 200,
    });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    return NextResponse.json({
      message: "Unexpected error? Unknown issue with creating studyguide?",
      status: 500,
    });
  }
}
  

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderParam = searchParams.get("order") || "dateCreatedDesc";
  const searchQuery = searchParams.get("search") || "";

  const match = orderParam.match(/^(name|lastModified|dateCreated)(Asc|Desc)$/);
  if (!match) {
    return NextResponse.json({ error: "Invalid order parameter" }, { status: 400 });
  }

  const field = match[1];
  const direction = match[2] === "Asc" ? "asc" : "desc";

  const guides = await prisma.studyGuide.findMany({
    orderBy: {
      [field]: direction,
    },
    where: {
      userID: "abc1",
      ...(searchQuery && {
        name: {
          contains: searchQuery,
          mode: "insensitive",
        },
      }),
    },
  });

  return NextResponse.json(guides);
}

