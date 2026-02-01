import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prismaClientSingleton = () => {
  // Safe check for build environments where DATABASE_URL might be missing
  // Vercel Build Step often lacks env vars unless configured specifically.
  // We return a standard client, but if it fails to connect lazily, it will be at runtime, not module load time.
  return new PrismaClient({
    log: ['query'],
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { TransactionType, Role, OrderStatus } from '@prisma/client';
