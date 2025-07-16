"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateStudyGuideDialog({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [name, setName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  
  useEffect(() => {
    const fetchTags = async () => {
      const res = await fetch("/api/tags");
      const data = await res.json();
      setAllTags(data.map((tag: { name: string }) => tag.name));
    };
    fetchTags();
  }, []);

  const handleSelectTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput("");
    setDropdownOpen(false);
  };

  const handleCreateAndAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
    }
    setTagInput("");
    setDropdownOpen(false);
  };

  const saveHandler = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      const response = await fetch("/api/studyguides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studyGuideName: name,
          tags: selectedTags,
        }),
      });

      const data = await response.json();
      console.log(data.message);

      if (response.ok) {
        onCreated?.();
        setOpen(false);
        setName("");
        setTagInput("");
        setSelectedTags([]);
      }
    } catch (error) {
      console.error("Failed to save study guide:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(tagInput.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="absolute top-2 right-5 rounded-lg p-4 bg-purple-400 hover:bg-purple-500">
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create Study Guide</DialogTitle>
          <DialogDescription>
            Enter a name and optional tags for your study guide.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Algebra Notes"
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <Label>Tags (optional)</Label>
            <Input
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
              placeholder="Search or create tags"
            />

            {dropdownOpen && (
              <div className="absolute top-full mt-1 bg-white border shadow-md z-10 rounded-md w-full max-h-48 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <div
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {tag}
                  </div>
                ))}
                {tagInput.trim() && !filteredTags.includes(tagInput.trim()) && (
                  <div
                    onClick={handleCreateAndAddTag}
                    className="px-3 py-2 hover:bg-gray-200 cursor-pointer text-green-600"
                  >
                    + Create tag "{tagInput}"
                  </div>
                )}
              </div>
            )}

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTags((prev) => prev.filter((t) => t !== tag))
                      }
                      className="ml-2 text-purple-800 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={saveHandler} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
