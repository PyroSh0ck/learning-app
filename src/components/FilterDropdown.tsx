"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Dispatch, SetStateAction } from "react";

export default function FilterDropdown({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}) {
  const options = [
    { label: "Date Created ↓", value: "dateCreatedDesc" },
    { label: "Date Created ↑", value: "dateCreatedAsc" },
    { label: "Name A–Z", value: "nameAsc" },
    { label: "Name Z–A", value: "nameDesc" },
    { label: "Last Modified ↓", value: "lastModifiedDesc" },
    { label: "Last Modified ↑", value: "lastModifiedAsc" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img
          src="/filter.svg"
          className="ml-3 h-10 w-10 cursor-pointer hover:opacity-80 transition"
          alt="Filter"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={filter === option.value ? "bg-purple-100 font-semibold" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
