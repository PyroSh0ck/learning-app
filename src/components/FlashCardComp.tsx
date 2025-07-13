'use client'
import { FlashCard } from '@prisma/client'
import React, { useState } from 'react'

export default function FlashCardComp({ card } : { card : FlashCard} ) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className='w-full flex justify-center items-center h-screen bg-gray-100'>
      <div onClick={() => setFlipped(!flipped)} className="relative w-64 h-40 perspective-normal">
        <div className={`absolute w-full h-full transform-3d transition-transform duration-700 ease-in-out ${flipped ? "rotate-y-180" : ""}`}>
          <div className="absolute w-full h-full bg-black text-white rounded-lg shadow-md flex items-center justify-center text-xl font-semibold backface-hidden"> {card.frontContent} </div>
          <div className="absolute w-full h-full bg-black text-white rounded-lg shadow-md flex items-center justify-center text-md font-light rotate-y-180 backface-hidden"> {card.backContent} </div>
        </div>
      </div>
    </div>
  )
}
