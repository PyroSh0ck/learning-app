"use client";
import { StudyGuide } from "@prisma/client";
import StudyGuideCreator from "./StudyGuideCreator";
import { useState } from "react";
import Link from "next/link";

export default function StudyGuideWrapper({ res }: { res: StudyGuide[] }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div>
        <StudyGuideCreator visible={modalOpen} res={res} />

        <button
          className="bg-blue-500 text-white px-6 py-4 rounded hover:bg-blue-600 transition-colors duration-100  absolute top-3 right-5"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Create Study Guide
        </button>
        <div className="flex justify-center items-center flex-col w-screen h-60 overflow-y-scroll no-scrollbar ">
          {res.map((studyGuide: StudyGuide) => (
            <Link
              href={`/dashboard/${studyGuide.id}`}
              key={studyGuide.id}
              className="bg-purple-900 w-1/3 h-1/3 rounded-lg m-2 text-center text-2xl pt-2 pb-2 relative flex justify-center"
            >
              <button>
                <div>{studyGuide.name}</div>
                {studyGuide.tag && (
                  <div className="absolute top-2.5 right-2 text-sm bg-purple-950 text-black px-2 py-1 rounded">
                    {studyGuide.tag}
                  </div>
                )}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
