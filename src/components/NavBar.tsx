'use client'
import Image from "next/image"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

export default function NavBar() {
  const { data: session } = useSession()

  if (!session?.user) {
    return (
        <div className="bg-white border-8 border-purple-400 border-double rounded-lg flex flex-row place-content-between p-8 w-full">
          <div className="flex flex-row place-content-around">
            <Image alt="logo" src="/logo4.svg" width={80} height={80}/>
            <Link href="/" className="text-purple-400 text-3xl m-5 ml-10 font-black hover:text-purple-800 transition-colors duration-175 ease-in-out">Home</Link>
          </div>
          <Link href='/login' className="text-purple-400 text-3xl m-5 font-black hover:text-purple-800 transition-colors duration-175 ease-in-out">Login</Link>
        </div>
      )
  } else {
    return (
      <div className="bg-white border-8 border-purple-400 border-double rounded-lg flex flex-row place-content-between p-8">
        <div className="flex flex-row">
          <Image alt="logo" src="/logo4.svg" width={80} height={80}/>
          <Link href="/" className="text-purple-400 text-3xl m-5 ml-10 font-black hover:text-purple-800 transition-colors duration-175 ease-in-out">Home</Link>
          <Link href="/study" className="text-purple-400 text-3xl m-5 font-black hover:text-purple-800 transition-all duration-175 ease-in-out">Study</Link>
        </div>
        <img onClick={() => signOut()} alt="profile picture" src={session?.user?.image ?? '/guest.svg'} className="justify-self-end w-20 h-20 rounded-full" />
      </div>
    )
  }
}

