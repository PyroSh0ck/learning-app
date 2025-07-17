import { prisma } from '@/lib/db'
import { Tag } from '@prisma/client'
import { NextResponse } from 'next/server'
import { NextAuthRequest } from 'next-auth'
import { auth } from "@/auth"



export const POST = auth(async function POST(req: NextAuthRequest) {
  const body = await req.json();
  const { studyGuideName, tagsGiven } : { studyGuideName : string, tagsGiven : string[]} = body;
  const session = req.auth

  if (session) {
    const currentUserID = session.user?.id

    if (currentUserID != undefined) {
      if (studyGuideName.trim() != "" && studyGuideName && studyGuideName != undefined) {

        const createdGuide = await prisma.studyGuide.create({
          data: {
            name: studyGuideName,
            userID: currentUserID,
          }
        })
        
        const tagArr : Tag[] = []

        if (!tagsGiven || tagsGiven == undefined) {
          return NextResponse.json({
            message: "Created studyguide without tags because the tagsGiven array was undefined.",
            status: 400,
          })
        }

        tagsGiven.forEach(async (tag : string | null | undefined) => {
          if (tag && tag != undefined) {
            if (tag.trim() != "") {
              try {
                const foundTag = await prisma.tag.upsert({
                  where: {
                    tagId: { 
                      name: tag,
                      userID: currentUserID,
                    }
                  },
                  update: {},
                  create: {
                    name: tag,
                    studyGuideID: createdGuide.id,
                    userID: currentUserID,
                  }
                })
                
                tagArr.push(foundTag)
              } catch {
                return NextResponse.json({
                  message: "Unknown error caught while creating tags. Probably a problem with prisma upsert.",
                  status: 500,
                })
              }
            }
          }
        });
        try {
          const updatedGuide = await prisma.studyGuide.update({
            where: {
              id: createdGuide.id,
            },
            data: {
              tags: {
                create : tagArr
              }
            }
          })

          return NextResponse.json(updatedGuide)
        } catch {
          return NextResponse.json({
            message: "This is jacob's fault. The update prisma function's create parameter probably doesn't take an array as a value.",
            status: 500,
          })
        }
        
      } else {
        return NextResponse.json({
          message: "Unable to create studyguide, invalid name.",
          status: 400,
        })
      }
      
    } else {
      return NextResponse.json({
        message: "Unable to create studyguide, user ID is invalid.",
        status: 400,
      })
    }

  } else {
    return NextResponse.json({
      message: "Unable to create studyguide, user session is invalid.",
      status: 400,
    })
  }
})


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
      include: {
        tags: true,
      }
    });

    return NextResponse.json(guides);
  }
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})
