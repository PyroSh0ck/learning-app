import StudyGuideClient from "@/components/StudyGuideClient"
import { auth } from "@/auth";
import Link from "next/link";

export default async function page({ params } : { params : Promise<{ studyGuideID : string }> }) {
    const session = await auth()

    if (!session?.user) {
      return (
        <div>
          <h1>401 USER NOT AUTHORIZED</h1>
          <Link href="/">Go Home</Link>
        </div>
      )
    } else {
        const { studyGuideID } = await params
        return (
            <StudyGuideClient guideID={studyGuideID} />
        )
    }
    return (
            <StudyGuideClient guideID={studyGuideID} />
    )
}
