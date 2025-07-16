import { prisma } from '@/lib/db'
import { StudyGuide } from '@prisma/client'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { studyGuideName, tags } = body;

  if (!studyGuideName || studyGuideName === "") {
    return NextResponse.json({
      message: "Studyguide was unable to be saved. No name was sent.",
      status: 500,
    });
  }

  try {
    if (tags === ""){
        const createdStudyGuide = await prisma.studyGuide.create({
        data: {
            name: studyGuideName,
            userID: "abc1"
        },
    });
    } else {
        const createdStudyGuide = await prisma.studyGuide.create({
        data: {
            name: studyGuideName,
            userID: "1", 
            tag: tags, 
        },
    });
    }


    return NextResponse.json({
      message: "Saved Studyguide!",
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({
      message: "Unexpected error? Unknown issue with creating studyguide?",
      status: 500,
    });
  }
}


