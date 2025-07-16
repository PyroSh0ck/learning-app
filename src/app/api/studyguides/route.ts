import { prisma } from '@/lib/db'
import { StudyGuide } from '@prisma/client'
import { NextResponse, NextRequest } from 'next/server'
import { auth } from "@/auth"
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
  


export const GET = auth(async function GET(req) {
  if (req.auth) {
    const { searchParams } = new URL(req.url)
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
        userID: req.auth.user!.id,
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
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})
