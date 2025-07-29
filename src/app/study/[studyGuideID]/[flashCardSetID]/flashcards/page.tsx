// import FlashCardList from '@/components/FlashCardList'

export default async function FlashCardPage({ params } : { params: Promise<{ studyGuideID: string, flashCardSetID: string }>} ) {
  const {studyGuideID, flashCardSetID} = await params
  const limit = 50
  const iteration = 1
  const res : Response = await fetch(`/api/${studyGuideID}/${flashCardSetID}?limit=${limit}&iteration=${iteration}`)
  const flashcards = await res.json()

  return (
    <div>
      {/* <FlashCardList studyGuideID={studyGuideID} flashCardSetID={flashCardSetID} initialCards={flashcards} /> */}
    </div>
  )
}

