"use client";
import { Tag } from "@prisma/client";
import { SetStateAction, Dispatch, useState } from "react";

export default function TagDropdown({
  res,
  tag,
  setTag,
}: {
  res: Tag[];
  tag: string[];
  setTag: Dispatch<SetStateAction<string[]>>;
}) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = res.filter((t) =>
    t.name.toLowerCase().includes(input.toLowerCase())
  );

  const handleSelect = (name: string) => {
    if (!tag.includes(name)) {
      setTag([...tag, name]);
    }
    setInput("");
    setIsOpen(false);
  };

  const handleCreate = () => {
    if (input.trim() && !tag.includes(input.trim())) {
      setTag([...tag, input.trim()]);
    }
    setInput("");
    setIsOpen(false);
  };


  const handleRemoveTag = (name: string) => {
    setTag(tag.filter((t) => t !== name));
  };

  return (
    <div className="relative flex flex-col items-center justify-start bg-gray-800 m-4 w-64">
      <input
        className="border-white rounded-lg p-2 m-2 w-full"
        type="text"
        placeholder="Search or create tag"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
      />

      <div className="flex flex-wrap gap-2 px-2">
        {tag.map((t) => (
          <span
            key={t}
            className="bg-purple-300 text-black px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {t}
            <button onClick={() => handleRemoveTag(t)} className="text-red-500">×</button>
          </span>
        ))}
      </div>

      {isOpen && (
        <div className="absolute top-full w-full text-center flex flex-col items-center bg-gray-700 max-h-48 overflow-y-auto rounded-md shadow-md z-10">
          {filtered.map((t) => (
            <div
              onClick={() => handleSelect(t.name)}
              key={t.id}
              className="w-full hover:bg-gray-600 cursor-pointer py-1"
            >
              {t.name}
            </div>
          ))}
          <hr className="w-4/5 self-center my-1" />
          {input.trim() && !filtered.some((t) => t.name === input.trim()) && (
            <div
              onClick={handleCreate}
              className="hover:bg-gray-600 w-full py-1 cursor-pointer text-green-400"
            >
              + Create tag "{input.trim()}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
