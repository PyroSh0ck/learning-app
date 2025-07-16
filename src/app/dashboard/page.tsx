import StudyGuideWrapper from "@/components/StudyGuideWrapper";
import { prisma } from "@/lib/db";
import { StudyGuide } from "@prisma/client";
export default async function page() {
  const res: StudyGuide[] = await prisma.studyGuide.findMany({
    orderBy: [
      {
        dateCreated: "desc",
      },
    ],
  });

  return (
    <div className="flex  items-center h-screen w-full flex-col">
      <h1 className="text-3xl m-2">Study Guides</h1>
      <hr className="w-4/5 m-4" />
      <div>
        <StudyGuideWrapper res={res} />
      </div>
    </div>
  );
}
