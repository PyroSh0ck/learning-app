import NavBar from "@/components/NavBar";
import { auth } from "@/auth";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
// import StudyGuidesWrapper from "@/components/StudyGuidesWrapper";
import StudyClient from "@/components/StudyClient";

export default async function page() {
    const session = await auth()

    if (!session?.user) {
      return (
        <div>
          <h1>401 USER NOT AUTHORIZED</h1>
          <Link href="/">Go Home</Link>
        </div>
      )
    } else {
      return (
        <SessionProvider>
          <NavBar />
          <StudyClient />
        </SessionProvider>
        
      )
    }
}

