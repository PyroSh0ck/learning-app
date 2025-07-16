"use client";
import { useState } from "react";
import StudyGuideWrapper from "./StudyGuideWrapper";
import { StudyGuide } from "@prisma/client";

export default function StudyGuideWrapperWrapper({
  res,
}: {
  res: StudyGuide[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div
      className={`flex items-center h-screen w-full flex-col ${modalOpen ? "bg-black bg-opacity-70" : ""}`}
    >
      <h1 className="text-3xl m-2">Study Guides</h1>
      <hr className="w-4/5 m-4" />
      <div className="">
        <StudyGuideWrapper
          res={res}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </div>
    </div>
  );
}
