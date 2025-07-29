import NavBar from "@/components/NavBar"
import StudyGuideClient from "@/components/StudyGuideClient"
import { StudyGuide_f } from "@/lib/prismaTypes"
import { Suspense } from "react"

export default async function page({ params } : { params : Promise<{ studyGuideID : string }> }) {
    const { studyGuideID } = await params

    const res = await fetch(`/api/studyguides?id=${studyGuideID}`)
    const guide : StudyGuide_f = await res.json()

    return (
        <div className='relative w-full h-screen'>
            <Suspense>
                <NavBar />
            </Suspense>
            <StudyGuideClient guide={guide} />
        </div>
    )
}
