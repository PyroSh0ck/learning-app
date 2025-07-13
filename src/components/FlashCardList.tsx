'use client'
import { useState, useEffect } from 'react'
import { FlashCard } from "@prisma/client"

import FlashCardComp from './FlashCardComp'

export default function FlashCardList({ studyGuideID, flashCardSetID, initialCards }: { studyGuideID: string, flashCardSetID: string, initialCards: FlashCard[] } ) {
    const tempArr : FlashCard[] = []
    const [cards, setCards] = useState(tempArr)
    const [iteration, setIteration] = useState(1)

    const limit = 50

    setCards(initialCards)

    useEffect(() => {
        fetch(`/api/${studyGuideID}/${flashCardSetID}?limit=${limit}&iteration=${iteration}`)
        .then(res => res.json())
        .then(data => setCards(data))
    }, [iteration, flashCardSetID, studyGuideID])


    return (
        <div>
            {cards.map((card, index) => (
               <FlashCardComp key={index} card={card} />
            ))}
            <button onClick={() => setIteration(iteration + 1)}>
                Load More!
            </button>
        </div>
    )
}

