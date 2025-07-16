import StudyGuidesWrapper from "@/components/StudyGuidesWrapper";
import { prisma } from "@/lib/db";
import { StudyGuide } from "@prisma/client";
export default async function page() {
  return (
    // <StudyGuideWrapperWrapper   res={res}  />
    <StudyGuidesWrapper />
  );
}
