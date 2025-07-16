import NavBar from "@/components/NavBar";
import { auth } from "@/auth";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";

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
        <div className="bg-white h-screen">
          <SessionProvider>
            <NavBar type={"study"} />
          </SessionProvider>
          <h1 className="bg-white text-3xl text-purple-600 font-extrabold m-2 ml-10 mt-10" >Welcome back {session.user.name} </h1>
          <hr className="bg-purple-600 text-purple-600 h-1 w-7/8 ml-8"/>
          <div className="flex flex-row justify-start items-start p-15 w-full h-full" >
            <div className="flex flex-col justify-start items-center w-1/5 bg-white border-r-5 pr-20 border-solid border-purple-700 h-full">
              <h1 className="bg-white text-3xl text-purple-600 font-extrabold m-2 ml-10 mt-10" >Study Guides</h1>
            </div>
            <div className="flex flex-col justify-start items-center w-4/5 h-full">
              <h1 className="bg-white text-3xl text-purple-600 font-extrabold m-2 ml-10 mt-10" > Stats </h1>
              <div className="flex flex-row justify-start items-center h-full place-content-between">
                <div className="flex flex-col justify-center items-center h-1/6 w-1/4">
                  <h1>Time spent yesterday</h1>
                </div>
                <div className="flex flex-col justify-center items-center h-1/6 w-1/4">
                  <h1>Test accuracy</h1>
                </div>
              </div>
              <div className="flex flex-row justify-start items-center h-full">
                <div className="flex flex-col justify-center items-center h-0.2">
                  <h1>Most Reviewed Flashcards</h1>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h1>Most Reviewed Studyguides</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      )
    }
}

