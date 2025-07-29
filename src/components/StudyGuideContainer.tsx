import { Tag } from "@prisma/client";

export default function StudyGuideContainer({
  studyGuide,
}: {
  studyGuide: { completed: boolean, completedBy: Date | null, dateCreated: Date, id: string, lastModified: Date, name: string, userID: string, tags: Tag[]};
}) {
  return (
    <div className="flex shrink-0 flex-row place-content-evenly border-2 rounded-xl w-3/5 h-50 m-3 bg-gray-300 text-black shadow-lg transition hover:shadow-xl hover:scale-[1.01]" >
      <div className="flex flex-col justify-center items-center w-1/6">
          <img src="/physics.png" className="h-20 w-20"></img>
      </div>
      <div className="flex flex-col w-2/3 h-full place-content-evenly">
        <h1 className="text-center text-xl text-gray-800 font-semibold">
          {studyGuide.name}
        </h1>
        <div className="flex flex-row place-content-between">
          <div className="border-1 rounded-xl text-center w-full h-20 text-gray-600 text-lg">
            {" "}
            descrption
          </div>
        </div>
        <div className="flex flex-row justify-start items-center">
          <h1 className="text-center uppercase text-xs text-gray-500" >Tags:</h1>
          {studyGuide.tags.map(tag => (
            <div key={tag.id} className={`bg-${tag.color} w-max p-2 ml-2 rounded-2xl text-[0.65rem] font-bold text-white`}>{tag.name}</div>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-1/6 justify-center items-center">
          <img src="/circle.png" className="h-20 w-20"></img>
      </div>
      

    </div>
  );
}
