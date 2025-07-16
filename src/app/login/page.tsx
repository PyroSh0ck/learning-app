import NavBar from "@/components/NavBar";
import { signIn } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default function page() {
  return (
    <div className="h-screen w-full flex flex-col justify-start items-center bg-white">

        <SessionProvider><NavBar type={"login"} /></SessionProvider>
        <div className="bg-purple-800 w-2/5 h-4/5 border-purple-900 rounded-lg mt-20 flex flex-col justify-start items-center mb-20">
            <h1 className="text-3xl font-black lg:m-15 m-4 text-white">Log In</h1>

                <div className="bg-purple-400 rounded-lg w-4/5 h-[58%] flex flex-col justify-start items-center">
                    <div className="flex flex-col lg:flex-row justify-center items-center lg:p-10 m-2 h-1/3 w-full">
                        <h1 className="lg:text-2xl md:text-lg font-bold text-white lg:mr-4 ">Username:</h1>
                        <input type="text" defaultValue="" className="bg-purple-900 rounded-lg h-full lg:w-4/5 w-full" />
                    </div>
                    <div className="flex flex-col lg:flex-row justify-center items-center lg:p-10 m-2 h-1/3 w-full">
                        <h1 className="lg:text-2xl md:text-lg font-bold text-white lg:mr-4">Password:</h1>
                        <input type="text" defaultValue="" className="bg-purple-900 rounded-lg h-full lg:w-4/5 w-full"/>
                    </div>
                    <form action={async() => {
                        'use server'
                        await signIn("google", { redirectTo: "/"})
                    }}>
                        <button type="submit" className="bg-purple-900 hover:bg-purple-800 hover:scale-[1.01] hover:text-purple-100 transition-all duration-75 ease-in-out p-3 rounded-lg font-bold text-white">Log In With Google!</button>
                    </form>
                </div>

        </div>
    </div>
  )
}
