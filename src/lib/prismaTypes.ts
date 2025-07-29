import { Prisma, Tag } from "@prisma/client";

// Custom Prisma Query Args

export const studyGuideTagArgs = Prisma.validator<Prisma.StudyGuideDefaultArgs>()({
  include: {
    tags: true,
  },
});

export const studyGuideFullArgs = Prisma.validator<Prisma.StudyGuideDefaultArgs>()({
  include: {
    tags: true,
    StudySet: true,
  },
});


// Custom Prisma Types

export type StudyGuide_t = Prisma.StudyGuideGetPayload<typeof studyGuideTagArgs>;
export type StudyGuide_f = Prisma.StudyGuideGetPayload<typeof studyGuideFullArgs>;

// Prisma Type Predicates

export function isTag(tag: unknown): tag is Tag {
   return (tag as Tag).color !== undefined; 
}
