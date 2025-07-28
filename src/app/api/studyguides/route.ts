import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { NextAuthRequest } from 'next-auth'
import { auth } from "@/auth"
import { ConnectStruct } from '@/lib/customTypes'
import { AuthenticateUser, CheckIfValid } from '@/lib/customFuncs'



export const POST = auth(async function POST(req: NextAuthRequest) {

  const session = req.auth
  const valid = AuthenticateUser(session)
  
  if (typeof valid === 'string') {

    const userID = valid 

    const body = await req.json();
    const { studyGuideName, studyGuideDesc, tagIDsGiven } : { studyGuideName : string, studyGuideDesc : string, tagIDsGiven : ConnectStruct[]} = body;

    const check = CheckIfValid(studyGuideName, tagIDsGiven)

    if (check === true) {
      try {
        const createdGuide_t = await prisma.studyGuide.create({
          data: {
            name: studyGuideName,
            userID: userID,
            description: studyGuideDesc,
            ...(tagIDsGiven.length > 0 && {
              tags: {
                connect: tagIDsGiven
              }
            }),

          },
          include : {
            tags: true
          }
        })
        return NextResponse.json(createdGuide_t)
      } catch (err) {
        console.error(err)
        return NextResponse.json(
          { message: "Invalid tag ID(s) was/were given. Please check the array: ", err},
          { status: 400 }
        )
      } 
    } else {
      return check
    }
  } else {
    return valid
  }
})


export const GET = auth(async function GET(req: NextAuthRequest) {
  const session = req.auth

  const valid = AuthenticateUser(session)
  if (typeof valid === 'string') {
    const userID = valid 
    
    const searchParams = req.nextUrl.searchParams
    const orderParam = searchParams.get("order") || "dateCreatedDesc";
    const searchQuery = searchParams.get("search") || "";         
    
    const match = orderParam.match(/^(name|lastModified|dateCreated)(Asc|Desc)$/);
    if (!match) {
      return NextResponse.json({ error: "Invalid order parameter" }, { status: 400 });
    }

    const field = match[1];
    const direction = match[2] === "Asc" ? "asc" : "desc";
    try {
      const guides = await prisma.studyGuide.findMany({
        orderBy: [
          { [field]: direction },
        ],
        where: {
          userID: userID,
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        include: {
          tags: true,
        }
      });
      return NextResponse.json(guides);
  } catch (err) {
    return NextResponse.json(
      { message: "Error has occurred with the findMany prisma query", err },
      { status: 500 }
    )
  }
    
  } else {
    return valid
  }
})
