"use client";

import { StudyGuide_f } from "@/lib/prismaTypes";
import StatBox from "./StatBox";
import { StudySet } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CreateStudySetModal from "./CreateStudySetModal";
import ErrorMessage from "./ErrorMessage";
import { SessionProvider } from "next-auth/react";
import NavBar from "./NavBar";
import StudyGuideEdit from "./StudyGuideEdit";

function StatsComp({ headerName }: { headerName: string }) {
  return (
    <>
      <h1 className="w-full text-left pl-10 text-2xl font-bold text-purple-600">
        {headerName}
      </h1>
      <hr className="w-45 h-1 bg-purple-600 border-none self-start ml-7 rounded-lg mt-2" />
      <div className="statsHolder flex flex-row flex-wrap justify-center items-center w-full h-full mt-10 ">
        <StatBox text={"stat1"} />
        <StatBox text={"stat2"} />
        <StatBox text={"stat3"} />
        <StatBox text={"stat4"} />
        <StatBox text={"stat5"} />
        <StatBox text={"stat6"} />
      </div>
    </>
  );
}

export default function StudyGuideClient({ guideID }: { guideID: string }) {
  const [guide, setGuide] = useState<StudyGuide_f>();
  const [studySetModalOpen, setStudySetModalOpen] = useState(false);
  const [studySet, setStudySet] = useState<StudySet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [canClickOff, setCanClickOff] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [currentSet, setCurrentSet] = useState<StudySet>();

  useEffect(() => {
    const fetchFunc = async () => {
      const res = await fetch(`/api/studyguides?id=${guideID}`);
      setGuide(await res.json());
    };

    fetchFunc();
  }, [guideID]);




  useEffect(() => {
    if (!guide) return;
    setStudySet(guide.StudySet);
  }, [guide]);

  if (!guide) return <div></div>

  const setClickHandler = (studySet: StudySet) => {
    setCurrentSet(studySet);
  };

  if (guide === undefined) {
    return <div>How did u get here</div>;
  }

  return (
    <div className='relative w-full h-auto'>
      {studySetModalOpen && <div className="fixed h-screen w-full z-10 inset-0 bg-black opacity-50" onClick={() => canClickOff && setStudySetModalOpen(false)} />}
      <SessionProvider>
        <NavBar />
      </SessionProvider>
        <CreateStudySetModal
          modalOpen={studySetModalOpen}
          setModalOpen={setStudySetModalOpen}
          setStudySet={setStudySet}
          studyGuideID={guideID}
          setError={setError}
          setCanClickOff={setCanClickOff}
        />
      <div className="relative h-screen">
        {error && <ErrorMessage message={error} setMessage={setError} />}

        <div className="root flex flex-col justify-start items-center w-full h-4/5">
          <h1 className="my-20 font-black text-5xl text-center">{guide!.name}</h1>
          <div className="stats h-auto flex flex-col justify-start items-center w-full">
            <StatsComp headerName="General Stats" />
            <div className="studySetPlusStats flex flex-row w-full h-auto mt-30">
              <div className="studySet flex flex-col w-1/3 justify-start items-center">
                <h1 className="w-full text-center pl-10 text-2xl font-bold text-purple-600">
                  Study Sets
                </h1>
                <hr className="w-full h-[0.2rem] bg-purple-600 border-none self-start ml-7 mt-2" />
                <div className="studySetHolder flex flex-col items-center justify-start overflow-y-scroll no-scrollbar min-h-185 border-r-3 relative border-purple-600 w-full">
                  <button
                    onClick={() => setStudySetModalOpen(!studySetModalOpen)}
                    className="bg-purple-700 p-4 rounded-xl hover:bg-purple-800 text-white transition-colors duration-175 ease-in-out font-black absolute right-0 top-0 m-5 cursor-pointer"
                  >
                    Create +
                  </button>
                  {studySet.map((studySet) => (
                    <div
                      key={studySet.id}
                      onClick={() => {
                        setClickHandler(studySet);
                      }}
                    >
                      {studySet.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="studySetStat flex flex-col w-2/3 justify-start items-center">
                <h1 className="w-full text-center pl-10 text-2xl font-bold text-purple-600"> {currentSet?.name || 'Study Set'} Stats </h1>
                  <hr className='w-full h-1 bg-purple-600 border-none self-start ml-7 mt-2' />
                  <div className='statsHolder flex flex-row flex-wrap justify-center items-center w-full h-full mt-10'>
                      <StatBox text={'stat1'} />
                      <StatBox text={'stat2'} />
                      <StatBox text={'stat3'} />
                      <StatBox text={'stat4'} />
                      <StatBox text={'stat5'} />
                      <StatBox text={'stat6'} />
                  </div>
                  <Link href={`/study/${guideID}/${currentSet?.id}`} className="bg-purple-700 p-4 rounded-xl hover:bg-purple-800 text-white transition-colors duration-175 ease-in-out font-black cursor-pointer m-5" >Go to Studyset</Link>
              </div>
            </div>
          </div>
          <button onClick={() => {setEditOpen(true)}} className='absolute top-0 right-0 bg-purple-700 p-4 rounded-xl hover:bg-purple-800 text-white transition-colors duration-175 ease-in-out font-black cursor-pointer m-5'>Edit Studyguide</button>
        </div>
      </div>
     <StudyGuideEdit modalOpen={editOpen} setModalOpen={setEditOpen} setGuide={setGuide} guide={guide} />
    </div>
  );
}