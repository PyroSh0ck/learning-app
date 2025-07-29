'use client'

import { StudyGuide_f } from "@/lib/prismaTypes"
import StatBox from "./StatBox"
import { StudySet } from "@prisma/client"
import { useState } from "react"

export default function StudyGuideClient({ guide } : { guide : StudyGuide_f }) {

    const [currentSet, setCurrentSet] = useState<StudySet>()

    const setClickHandler = ( studySet : StudySet ) => {
        setCurrentSet(studySet)
    }

    return (
        <div className='root flex flex-col justify-start items-center w-full h-4/5'>
            <h1>{guide.name}</h1>
            <div className='stats flex flex-col justify-start items-center'>
                <h1 className="w-full text-left">General Stats</h1>
                <div className='statsHolder flex flex-row place-content-evenly'>
                    <StatBox text={'stat1'} />
                    <StatBox text={'stat2'} />
                    <StatBox text={'stat3'} />
                    <StatBox text={'stat4'} />
                    <StatBox text={'stat5'} />
                    <StatBox text={'stat6'} />
                </div>
                <div className='studySetPlusStats flex flex-row'>
                    <div className='studySet flex flex-col w-1/3 justify-start items-center'> 
                        <h1 className='w-full text-center'>Study Sets</h1>   
                        <hr className='w-full h-3' />
                        <div className='studySetHolder flex flex-col border-r-2 border-purple-600 items-center justify-start overflow-y-scroll no-scrollbar'>
                            {guide.StudySet.map(studySet => (
                                <div key={studySet.id} onClick={() => {setClickHandler(studySet)}}>{studySet.name}</div>
                            ))}
                        </div>
                    </div>
                    <div className='studySetStat flex flex-col w-2/3 justify-start items-center'>
                        <h1> {currentSet?.name || 'Study Set'} Stats </h1>
                        <div className='studySetStatHolder flex flex-row place-content-evenly'>
                            <StatBox text={'stat1'} />
                            <StatBox text={'stat2'} />
                            <StatBox text={'stat3'} />
                            <StatBox text={'stat4'} />
                            <StatBox text={'stat5'} />
                            <StatBox text={'stat6'} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
