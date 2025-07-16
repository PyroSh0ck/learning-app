import { StudyGuide } from "@prisma/client";

export default function StudyGuideContainer({
  studyGuide,
}: {
  studyGuide: StudyGuide;
}) {
  return (
    <div
      className="flex shrink-0 flex-col place-content-around border-2 rounded-xl w-3/5 h-50 m-3 bg-gray-300 text-black shadow-lg transition hover:shadow-xl hover:scale-[1.01]
"
    >
      <div>
        <h1 className="text-center text-xl text-gray-800 font-semibold">
          {studyGuide.name}
        </h1>
      </div>
      <div className="flex flex-row place-content-between">
        <div>
          <img src="/physics.png" className="h-20 w-20 ml-8"></img>
        </div>
        <div className="border-1 rounded-xl text-center w-3/5 h-20 text-gray-600 text-lg">
          {" "}
          descrption
        </div>
        <div>
          <img src="/circle.png" className="h-20 w-20 mr-8"></img>
        </div>
      </div>
      <div>
        <h1 className="text-center uppercase text-xs text-gray-500">tags</h1>
      </div>
    </div>
  );
}
