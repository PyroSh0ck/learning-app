'use client'

import { StudyGuide_t } from "@/lib/prismaTypes"

function Icon({ image } : { image: string | null}) {
    return (
        <div className="flex flex-col justify-center items-center w-1/6">
          <img src={`${image ? image : '/physics.png'}`} alt="study guide icon" className="h-20 w-20"></img>
        </div>
    )
}

function Content({ guide } : { guide : StudyGuide_t }) {
    return (
        <div className="flex flex-col w-2/3 h-full place-content-evenly">
            <h1 className="text-center text-xl text-white font-black">
                {guide.name}
            </h1>
            <div className="flex flex-row place-content-between">
            <div className="border-2 rounded-xl text-center p-2 w-full h-20 text-white text-lg">
                {guide.description}
                
            </div>
            </div>
            <div className="flex flex-row justify-start items-center">
            <h1 className="text-center uppercase text-xs text-white font-black" >Tags:</h1>
            { guide.tags !== undefined ? guide.tags.map(tag => (
                <div key={tag.id} style={ { backgroundColor : tag.color }} className={`z-20 w-max min-w-10 text-center p-2 ml-2 rounded-2xl text-[0.65rem] font-bold text-white`}>{tag.name}</div>
            )) : ''}
            </div>
        </div>
    )
}

function Progress() {
    return (
        <div className="flex flex-col w-1/6 justify-center items-center">
            <img src="/circle.png" alt="progress" className="h-20 w-20"></img>
        </div>
    )
}
function FilteredGuide({ guide } : { guide : StudyGuide_t }) {
    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className="flex shrink-0 flex-row place-content-evenly border-2 rounded-xl w-3/5 h-50 m-3 bg-purple-600 text-black shadow-lg transition hover:shadow-xl hover:scale-[1.01]" >
                <Icon image={null} />
                <Content guide={guide} />
                <Progress />
            </div>
        </div>
    )
}

export default function FilteredGuides({ guides } : { guides : StudyGuide_t[]}) {
    console.log(guides.length)
    return (
        <div className='w-full'>
            {guides.map(guide => (
                <FilteredGuide key={guide.id} guide={guide} />
            ))}
        </div>
    )
}

