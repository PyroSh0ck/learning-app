import NavBar from "@/components/NavBar"
import StudyGuideClient from "@/components/StudyGuideClient"
import { SessionProvider } from "next-auth/react"

export default async function page({ params } : { params : Promise<{ studyGuideID : string }> }) {
    const { studyGuideID } = await params

    return (
        <div className='relative w-full h-auto'>
            <SessionProvider>
                <NavBar />
            </SessionProvider>
            <StudyGuideClient guideID={studyGuideID} />
        </div>
    )
}
