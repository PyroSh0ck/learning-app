import { PrismaClient } from '@prisma/client'

// Nextjs uses hot reloading, which re-imports files multiple times
// to avoid this we created a global variable called
// globalThis.prisma, so we only create one instance of PrismaClient across reloads

// globalThis is a special object that refers to the global scope in any js environment
// typescript cannot validate this guys type, so we first declare it "as unknown"
// then we tell typescript that for this file, we will declare it as the type
// { prisma: PrismaClient | undefined }
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// creates a prisma variable and exports it, which is equal to either globalForPrisma.prisma or if that doesn't exist
// then it creates a new PrismaClient() and sets it equal to prisma
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// then, if we aren't in a production environment, globalForPrisma.prisma is set to the prisma 
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
