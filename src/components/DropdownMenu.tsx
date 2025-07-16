"use client";
import { StudyGuide } from "@prisma/client";
import { SetStateAction, Dispatch } from "react";
export default function DropdownMenu({ res, tag, setTag }: { res: StudyGuide[], tag : string, setTag : Dispatch<SetStateAction<string>>}) {

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTag(event.target.value);
  };
  return (
    <div className="relative flex flex-col items-center justify-start bg-gray-800 m-4">
      <input
        className="border-white rounded-lg p-2 m-2 peer"
        type="text"
        placeholder="Search for Tags"
        value={tag}
        onChange={changeHandler}
      />
      <div className="hidden absolute top-full peer-focus:flex w-full text-center flex-col items-center bg-gray-800 max-h-15 ">
        {res.map(( studyGuide: StudyGuide, index : number) => (
          <div
            onClick={() => {
              setTag(studyGuide.tag!);
            }}
            key={index}
          >
            {studyGuide.tag}
          </div>
        ))}
        <hr className="w-4/5 self-center" />
        <div>Tag not found?</div>
        <div className="hover:bg-gray-900 w-full">
          <button>Create tag</button>
        </div>
      </div>
    </div>
  );
}
