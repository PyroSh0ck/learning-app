'use client'

import SearchBar from "./SearchBar"
import FilteredGuides from './FilteredGuides'
import { useEffect, useState } from 'react'
import { StudyGuide_t } from "@/lib/prismaTypes" // custom prisma types :D

export default function StudyClient() {
    const [query, setQuery] = useState("")
    const [filter, setFilter] = useState("")
    const [guides, setGuides] = useState<StudyGuide_t[]>([])
    const [active, setActive] = useState(false)

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
                    setGuides(data)
                } else {
                    setGuides([])
                    console.error("Failed to fetch study guides, query returned null")
                }
            } catch (err) {
                console.error("Failed to turn fetched studyguides into valid javascript objects from the json", err)
            }
        }
        fetchGuides();
    }, [query, filter])

    return (
        <div className="relative">
            <button onClick={() => setActive(!active)} className="absolute right-0 top-0 m-5">Create +</button>
            <div>Study Guides</div>
            <SearchBar setQuery={setQuery} setFilter={setFilter} options={options} />
            <FilteredGuides guides={guides} />
            <Modal active={active} />
        </div>
  )
}
