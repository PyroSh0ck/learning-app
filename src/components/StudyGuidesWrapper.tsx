"use client";

import { StudyGuide } from "@prisma/client";
import StudyGuideContainer from "./StudyGuideContainer";
import CreateStudyGuideModal from "./CreateStudyGuideModal";
import { useEffect, useState } from "react";
import FilterDropdown from "./FilterDropdown";

export default function StudyGuidesWrapper() {
  const [filter, setFilter] = useState("dateCreatedDesc");
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([]);
  const [search, setSearch] = useState(""); 
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchStudyGuides = async () => {
      const res = await fetch(
        `/api/studyguides?order=${filter}&search=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudyGuides(data);
      } else {
        setStudyGuides([]);
        console.error("Invalid response:", data);
      }
    };
    fetchStudyGuides();
  }, [filter, query]);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-gray-100 text-black">
      <div>
        <div className="rounded-xl border-1 m-1 bg-purple-400 border-black">
          <h1 className="rounded-lg p-6 text-4xl border-2 m-3 font-bold border-black">
            Study Guides
          </h1>
        </div>
        <CreateStudyGuideModal onCreated={() => setFilter((prev) => prev)} />
      </div>

      <span className="flex w-4/5 h-20 m-6 p-3 items-center">
        <div className="flex items-center border-2 w-full place-content-between rounded-3xl h-15 border-purple-300 bg-purple-400 focus-within:border-black focus-within:bg-purple-400">
          <input
            className="w-9/10 pl-3 focus:outline-none bg-purple-400 text-black"
            placeholder="Search Math"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setQuery(search);
            }}
          />
          <span
            className="cursor-pointer mr-3"
            onClick={() => setQuery(search)}
          >
            <img src="/search.svg" alt="Search" />
          </span>
        </div>
        <FilterDropdown filter={filter} setFilter={setFilter} />
      </span>

      <div className="w-full h-140 flex items-center flex-col overflow-y-scroll no-scrollbar">
        {studyGuides.map((studyGuide) => (
          <StudyGuideContainer key={studyGuide.id} studyGuide={studyGuide} />
        ))}
      </div>
    </div>
  );
}
