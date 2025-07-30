'use client'

export default function StatBox({ text } : { text : string }) {
    return (
        <div className='w-full aspect-square flex flex-row basis-1/3 justify-center items-center'>
            <div className='w-7/9 aspect-square hover:w-8/10 transition-all duration-175 ease-in-out flex flex-row justify-center items-center bg-white rounded-lg outline-4 shadow-xl/20 outline-offset-2 outline-purple-600'>
                <h1>{text}</h1>
            </div>
        </div>
    )
}
