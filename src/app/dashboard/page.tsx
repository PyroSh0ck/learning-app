import StudyGuidesWrapper from "@/components/StudyGuidesWrapper";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import NavBar from "@/components/NavBar";
import Link from "next/link";
export default async function page() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div>
        <h1>401 USER NOT AUTHORIZED</h1>
        <Link href="/">Go Home</Link>
      </div>
    );
  } else {
    return (
      // <StudyGuideWrapperWrapper   res={res}  />
      <SessionProvider>
        <NavBar type={"study"} />
        <StudyGuidesWrapper />
      </SessionProvider>
    );
  }
}
