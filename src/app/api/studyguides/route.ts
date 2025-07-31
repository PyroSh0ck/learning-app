import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { NextAuthRequest } from 'next-auth'
import { auth } from "@/auth"
import { ConnectStruct } from '@/lib/customTypes'
import { AuthenticateUser, CheckIfValid } from '@/lib/customFuncs'
import { StudyGuide_f } from '@/lib/prismaTypes'



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

    const searchID = searchParams.get("id")
    
    if (searchID !== null) {
      try {
        const guide : StudyGuide_f | null = await prisma.studyGuide.findUnique({
          where: {
            id: searchID
          },
          include: {
            tags: true,
            StudySet: true
          }
        })

        if (guide === null) {
          return NextResponse.json(
            { message: "Error, could not find studyguide with given id" },
            { status: 400 }
          )
        }

        return NextResponse.json(guide)
      } catch (err) {
        return NextResponse.json( 
          { message: "Unexpected error with findUnique has occurred: ", err },
          { status: 500 }
        )
      }
    }
    
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

export const PATCH = auth(async function PATCH(req: NextAuthRequest) {
  const session = req.auth

  const valid = AuthenticateUser(session)

  if (typeof valid === 'string') {

    const searchParams = req.nextUrl.searchParams

    const id = searchParams.get('id')

    if (id) {
      const body = await req.json()

      const { name, description, tagIDs } : { name : string, description : string, tagIDs : ConnectStruct[] } = body

      const check = CheckIfValid(name, description, tagIDs)

      if (check === true) {
        const userID = valid

        const currentGuide = await prisma.studyGuide.findFirst({
          where : {
            userID: valid,
            id: id
          }
        })
        
        if (currentGuide) {
          try {
            const dupGuideName = await prisma.studyGuide.findUnique({
              where: {
                studyGuideID: {
                  name: name,
                  userID: userID
                }
              }
            })

            if (dupGuideName) {
              return NextResponse.json(
                { message: "Same Studyguide Name Error" },
                { status: 400 }
              )
            } else {
              const newGuide = await prisma.studyGuide.update({
                where: {
                  id: id
                },
                data : {
                  name: name,
                  description: description,
                  tags : {
                    connect: tagIDs
                  }
                },
                include: {
                  tags: true,
                  StudySet: true
                }
              })

              return NextResponse.json(newGuide)
            }
          } catch (err) {
            return NextResponse.json(
              { message: "An unexpected error has occurred with the findUnique prisma query for finding dup study guide names: ", err },
              { status: 500 }
            )
          }
        } else {
          return NextResponse.json(
            { message: "Error, user does not have permission to update this studyguide" },
            { status: 400 }
          )
        }
      } else {
        return check
      }
    }
  } else {
    return valid
  }
})
