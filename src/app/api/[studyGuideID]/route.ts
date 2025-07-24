import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { NextAuthRequest } from "next-auth";
import { auth } from "@/auth";

export const GET = auth(async function GET(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  try {
    const { studyGuideID } = await params; 

    if (studyGuideID === "" || !studyGuideID) {
            return NextResponse.json({ message: "StudyGuideID could not be found." }, { status: 400 });
    } 



    if (!req.auth.user?.id) {
        return NextResponse.json({
            message: "StudySet was unable to be obtained. The session does not have the user's ID.",
            status: 400,
        })
    }

    const currentUserID = req.auth.user?.id;

    
    const studyGuide = await prisma.studyGuide.findUnique({
        where: {
            id: studyGuideID
        }
    })


    if (!studyGuide){
        return NextResponse.json({
            message: "StudySet was unable to be obtained. Could not find the Study Guide.",
            status: 500,
        })
    }
    const ownerUserID = studyGuide?.userID
    
    if ((studyGuide.private && currentUserID != ownerUserID)) {
        return NextResponse.json({
            message: "StudySet was unable to be obtained. User does not have permission to get someone else's private studyguide.",
            status: 400,
        })
    }

    const data = await prisma.studySet.findMany({
        where: {
            studyGuideID: studyGuideID
        }
    })
    return NextResponse.json(data)
    
  } catch (err) {
    return NextResponse.json({ message: "Internal error", error: String(err) }, { status: 500 });
  }
});



export const POST = auth(async function POST(req, { params }) {
    if (!req.auth?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  try {
    const { studyGuideID } = await params; 

    if (studyGuideID === "" || !studyGuideID) {
            return NextResponse.json({ message: "StudyGuideID could not be found." }, { status: 400 });
    }  

    const body = await req.json();
    const { studySetName } : { studySetName : string } = body;

    if (!req.auth.user?.id) {
        return NextResponse.json({
            message: "StudySet was unable to be saved. The session does not have the user's ID.",
            status: 400,
        })
    }

    const currentUserID = req.auth.user?.id;

    
    const studyGuide = await prisma.studyGuide.findUnique({
        where: {
            id: studyGuideID
        }
    })


    if (!studyGuide){
        return NextResponse.json({
            message: "StudySet was unable to be saved. Could not find the Study Guide.",
            status: 500,
        })
    }
    const ownerUserID = studyGuide?.userID
    
    if ((currentUserID != ownerUserID)) {
        return NextResponse.json({
            message: "StudySet was unable to be saved. User does not have permission to save someone else's studyguide.",
            status: 400,
        })
    }


    if (!studySetName || typeof studySetName !== "string" || studySetName.trim() === "") {
        return NextResponse.json(
            { message: "Invalid study set name" }, 
            { status: 400 }
        );
    }

    const createdSet = await prisma.studySet.create({
        data : {
            name: studySetName,
            studyGuideID: studyGuideID
        }
    })
    return NextResponse.json(createdSet)
    
  } catch (err) {
    return NextResponse.json({ message: "Internal error", error: String(err) }, { status: 500 });
  }
});



export const PATCH = auth(async function PATCH(req, { params }) {  
if (!req.auth?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  try {
    const { studyGuideID } = await params; 

    if (studyGuideID === "" || !studyGuideID) {
            return NextResponse.json({ message: "StudyGuideID could not be found." }, { status: 400 });
    } 

    const body = await req.json();
    const { studySetName, studySetID } : { studySetName : string, studySetID : string} = body;

    if (!req.auth.user?.id) {
        return NextResponse.json({
            message: "StudySet was unable to be saved. The session does not have the user's ID.",
            status: 400,
        })
    }

    const currentUserID = req.auth.user?.id;

    
    const studyGuide = await prisma.studyGuide.findUnique({
        where: {
            id: studyGuideID
        }
    })


    if (!studyGuide){
        return NextResponse.json({
            message: "StudySet was unable to be saved. Could not find the Study Guide.",
            status: 500,
        })
    }
    const ownerUserID = studyGuide?.userID
    
    if ((currentUserID != ownerUserID)) {
        return NextResponse.json({
            message: "StudySet was unable to be saved. User does not have permission to save someone else's studyguide.",
            status: 400,
        })
    }


    if (!studySetName || typeof studySetName !== "string" || studySetName.trim() === "") {
        return NextResponse.json(
            { message: "Invalid study set name" }, 
            { status: 400 }
        );
    }

    const createdSet = await prisma.studySet.update({
        where : {
            id: studySetID
        },
        data : {
            name: studySetName,
        }
    })
    return NextResponse.json(createdSet)
    
  } catch (err) {
    return NextResponse.json({ message: "Internal error", error: String(err) }, { status: 500 });
  }
});


export const DELETE = auth(async function DELETE(req, { params }) {  
if (!req.auth?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  try {
    const { studyGuideID } = await params; 

    if (studyGuideID === "" || !studyGuideID) {
            return NextResponse.json({ message: "StudyGuideID could not be found." }, { status: 400 });
    } 

    const body = await req.json();
    const { studySetName, studySetID } : { studySetName : string, studySetID : string} = body;

    if (!req.auth.user?.id) {
        return NextResponse.json({
            message: "StudySet was unable to be saved. The session does not have the user's ID.",
            status: 400,
        })
    }

    const currentUserID = req.auth.user?.id;

    
    const studyGuide = await prisma.studyGuide.findUnique({
        where: {
            id: studyGuideID
        }
    })


    if (!studyGuide){
        return NextResponse.json({
            message: "StudySet was unable to be saved. Could not find the Study Guide.",
            status: 500,
        })
    }
    const ownerUserID = studyGuide?.userID
    
    if ((currentUserID != ownerUserID)) {
        return NextResponse.json({
            message: "StudySet was unable to be saved. User does not have permission to save someone else's studyguide.",
            status: 400,
        })
    }


    if (!studySetName || typeof studySetName !== "string" || studySetName.trim() === "") {
        return NextResponse.json(
            { message: "Invalid study set name" }, 
            { status: 400 }
        );
    }

    const createdSet = await prisma.studySet.delete({
        where : {
            id: studySetID
        }
    })
    return NextResponse.json({ message: "Deleted StudySet Successfully."}, { status: 200 })
    
  } catch (err) {
    return NextResponse.json({ message: "Internal error", error: String(err) }, { status: 500 });
  }
});


