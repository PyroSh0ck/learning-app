"use client";

import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  FormEvent,
  useRef,
} from "react";
import { StudySet } from "@prisma/client";

export default function CreateStudySetModal({
  modalOpen,
  setModalOpen,
  setStudySet,
  studyGuideID,
  setError,
  setCanClickOff,
}: {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setStudySet: Dispatch<SetStateAction<StudySet[]>>;
  studyGuideID: string;
  setError: Dispatch<SetStateAction<string | null>>;
  setCanClickOff: Dispatch<SetStateAction<boolean>>;
}) {
  const [studySetName, setStudySetName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const studySetNameRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (modalOpen && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [modalOpen]);

  const resetModal = () => {
    setStudySetName("");
    setSubmitted(false);
    setModalOpen(false);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (studySetName.trim() === "") {
      studySetNameRef.current?.focus();
      studySetNameRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    } else {
      const res = await fetch(`/api/${studyGuideID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studySetName: studySetName.trim(),
        }),
      });
      if (!res.ok) {
        console.error("Failed to create study set");
        setError("Failed to create study set");
        return;
      }
      setSubmitted(true);
      const data: StudySet = await res.json();
      setStudySet((prev) => [...prev, data]);

      resetModal();
    }
  };

  return (
    <div
      className={`root-holder outline-4 outline-offset-2  z-20 outline-purple-600 opacity-99 shadow-xl/30 fixed rounded-3xl bg-white w-1/6 justify-self-center top-1/3 h-1/3 flex-row justify-center items-center  ${modalOpen ? "flex" : "hidden"}`}
    >
      <div
        className={`relative modal-wrapper flex flex-col justify-start items-start w-9/10 h-9/10 pr-4 border-purple-600 'border-r-0' `}
      >
        <h1 className="p-5 font-black text-purple-700 text-2xl self-center mt-5">
          Create Study Set
        </h1>
        <hr
          className={`w-full self-center h-1 rounded-lg bg-purple-700 mb-5`}
        />
        <div
          className="x-button cursor-pointer hover:text-2xl transition-all duration-175 ease-in-out absolute self-end top-0 font-black text-xl text-purple-700"
          onClick={() => {
            resetModal();
          }}
        >
          x
        </div>
        <form
          onSubmit={submitHandler}
          ref={modalContentRef}
          className="relative modal-wrapper flex flex-col justify-self items-start w-full h-full overflow-y-scroll no-scrollbar"
        >
          <div className="input-wrapper flex flex-row justify-center items-center m-5">
            <h1 className="input-label text-purple-700 font-bold text-lg">
              Name:
            </h1>
            <div className="relative flex flex-col">
              <input
                value={studySetName}
                onChange={(e) => {
                  setStudySetName(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setCanClickOff(false);
                  } else {
                    setCanClickOff(true);
                  }
                }}
                type="text"
                placeholder="Ex: Algebra"
                ref={studySetNameRef}
                className={`${submitted === true && studySetName === "" ? "border-red-500" : "border-purple-700"} border-2 rounded-lg px-2.5 py-0.5 ml-3 transition-all duration-175 ease-in-out border-purple-700 focus:border-purple-700 focus:placeholder-purple-700 focus:outline-none focus:ring-0 placeholder-purple-400 hover:placeholder-purple-700 hover:bg-gray-100`}
              />
              {submitted && studySetName.trim() === "" && (
                <p className="absolute top-full text-red-500 text-sm mt-1 ml-5">
                  Name is required.
                </p>
              )}
            </div>
          </div>
          <div className="buttons-wrapper flex flex-row justify-end w-full items-center">
            <button
              type="submit"
              className="bg-purple-700 p-4 rounded-xl hover:bg-purple-800 text-white transition-colors duration-175 ease-in-out font-black cursor-pointer m-5 absolute right-0 bottom-0"
            >
              Create Study Guide
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
