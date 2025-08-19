import { Prisma, User } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { UserRepository } from '../user.repository'

export class PrismaUserRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data })
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    })
  }
}
