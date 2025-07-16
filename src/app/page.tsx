import NavBar from "@/components/NavBar";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    return (
      <SessionProvider>
        <NavBar type={"homeSignedIn"} />
      </SessionProvider>
    );
  } else {
    return (
      <SessionProvider>
        <NavBar type={"guest"} />
      </SessionProvider>
    )
  }
  
}
