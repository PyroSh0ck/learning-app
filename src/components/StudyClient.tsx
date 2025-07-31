'use client'

import SearchBar from "./SearchBar"
import FilteredGuides from './FilteredGuides'
import Root from "./Root"
import { useEffect, useState } from 'react'
import { StudyGuide_t } from "@/lib/prismaTypes" // custom prisma types :D
import NavBar from "./NavBar"
import { SessionProvider } from "next-auth/react"
import ErrorMessage from "./ErrorMessage"

export default function StudyClient() {
    const [query, setQuery] = useState("")
    const [filter, setFilter] = useState("")
    const [guides_t, setGuides_t] = useState<StudyGuide_t[]>([])
    const [active, setActive] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [canClickOff, setCanClickOff] = useState(true)
    const options = [
        { label: "Date Created ↓", value: "dateCreatedDesc" },
        { label: "Date Created ↑", value: "dateCreatedAsc" },
        { label: "Name A–Z", value: "nameAsc" },
        { label: "Name Z–A", value: "nameDesc" },
        { label: "Last Modified ↓", value: "lastModifiedDesc" },
        { label: "Last Modified ↑", value: "lastModifiedAsc" },
    ];

    useEffect(() => {
        const fetchGuides = async () => {
            const res = await fetch(`/api/studyguides?order=${filter}&search=${encodeURIComponent(query)}`)
           
            try {
                const data = await res.json()

                if (data) {
                    setGuides_t(data)
                } else {
                    setGuides_t([])
                    console.error("Failed to fetch study guides, query returned null")
                }
            } catch (err) {
                console.error("Failed to turn fetched studyguides into valid javascript objects from the json", err)
            }
        }
        fetchGuides();
    }, [query, filter])

    useEffect(() => {
        setCanClickOff(true);
    }, [active]);

    return (
        <div className='relative h-screen'>
            {active && <div className="fixed h-screen w-full z-10 inset-0 bg-black opacity-50" onClick={() => canClickOff && setActive(false)} />}
            <SessionProvider>
                <NavBar />
            </SessionProvider>
            <div className="relative flex flex-col justify-start items-center w-full h-4/5">
                <button onClick={() => setActive(!active)} className="bg-purple-700 p-4 rounded-xl hover:bg-purple-800 text-white transition-colors duration-175 ease-in-out font-black absolute right-0 top-0 m-5 cursor-pointer">Create +</button>
                <div className="peer text-5xl font-bold px-20 pt-20 pb-10 w-full text-center text-purple-700">Study Guides</div>
                <hr className="h-1 w-1/10 bg-purple-700 border-none rounded-3xl mb-20 hover:w-3/10 peer-hover:w-3/10 transition-all duration-475 ease-in-out" />
                <SearchBar setQuery={setQuery} setFilter={setFilter} options={options} />
                <FilteredGuides guides={guides_t} />  
            </div>
            <Root modalOpen={active} setModalOpen={setActive} setGuides_t={setGuides_t} setError={setError} setCanClickOff={setCanClickOff} />
            {error && <ErrorMessage message={error} setMessage={setError} />}
        </div>
  )
}
