import { StudyGuide } from "@prisma/client";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

export const AuthenticateUser = (session : Session | null) => {
    if (session) {
        if (session.user) {
            if (session.user.id && session.user.id !== undefined) {
                return session.user.id
            } else {
                return NextResponse.json(
                    { message: 'The user could not be authenticated. The user id is invalid. ' },
                    { status: 400 }
                )
            }
        } else {
            return NextResponse.json(
                { message: "User could not be authenticated. User is invalid. " },
                { status: 400 }
            )
        }
    } else {
        return NextResponse.json(
            { message: "User could not be authenticated. Session is invalid." },
            { status: 400 }
        )
    }
}

export const CheckIfValid = (...vars : unknown[]) => {
    for (const element of vars) {
        if (!element) {
            return NextResponse.json(
                { message: `Unexpected error. ${element} returned null`},
                { status: 400 }
            )
        }

        if (element === undefined) {
            return NextResponse.json(
                { message: `Unexpected error. ${element} is undefined. Is this intentional? `},
                { status: 400 }
            )
        }

        if (typeof element === 'string' && element.trim() === '') {
            return NextResponse.json(
                { message: `Unexpected error. ${element} is an empty string. Is this intentional? `},
                { status: 400 }
            )
        }

        if (Array.isArray(element) && element.length === 0) {
            console.log(`${element} is an empty array. Was this intentional? `)
        }
    };
    
    return true
}

export const CheckValidStudyGuide = ( studyGuide : StudyGuide | null, userID : string ) => {
    if (!studyGuide) {
        return NextResponse.json({
            message: "Unexpected Error. StudyGuide returned null.",
            status: 500,
        })
    }
    const ownerUserID = studyGuide.userID

    if ((userID !== ownerUserID)) {
        return NextResponse.json({
            message: "Unexpected Error. User does not have permission to access someone else's studyguide.",
            status: 400,
        })
    }

    return true
}
