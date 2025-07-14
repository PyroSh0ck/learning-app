"use client";
import { StudyGuide } from "@prisma/client";
import DropdownMenu from "./DropdownMenu";
import { useEffect, useState } from "react";
export default function StudyGuideCreator({
  visible,
  res,
}: {
  visible: boolean;
  res: StudyGuide[];
}) {
  const [name, setName] = useState("")
  const [tag, setTag] = useState("")
  const saveHandler = async () => {
  try {
    const response = await fetch('/api/studyguides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studyGuideName: name,
        tags: "",
      }),
    });

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("Failed to save study guide:", error);
  }
};
  return (
    <div
      className={`${!visible ? "hidden" : ""} h-80 w-120 flex flex-col justify-start items-center z-1 position: absolute bg-gray-600 p-6 rounded-lg `}
    >
      <h1 className="text-center">Study Guide Creator</h1>
      <hr className="h-0.5 bg-black w-24 border-black mb-3 mt-1.5" />
      <div className="flex flex-row justify-center items-center">
        <h3 className="m-2">Name: </h3>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="bg-gray-400"
        />
      </div>
      <div className="flex flex-row justify-center items-center">
        <h2>Tags:</h2>
        <DropdownMenu res={res} tag={tag} setTag={setTag} />
      </div>
      <button onClick={saveHandler}>Create StudyGuide</button>
    </div>
  );
}
