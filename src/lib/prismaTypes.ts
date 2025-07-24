import { Prisma } from "@prisma/client";

export const studyGuideTagArgs = Prisma.validator<Prisma.StudyGuideDefaultArgs>()({
  include: {
    tags: true,
  },
});

export const studyGuideFullArgs = Prisma.validator<Prisma.StudyGuideDefaultArgs>()({
  include: {
    tags: true,
  },
});



export type StudyGuide_t = Prisma.StudyGuideGetPayload<typeof studyGuideTagArgs>;
export type StudyGuide_f = Prisma.StudyGuideGetPayload<typeof studyGuideFullArgs>;
