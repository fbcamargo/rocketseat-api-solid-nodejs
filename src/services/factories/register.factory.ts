import { PrismaUserRepository } from '@/repositories/prisma/user.repository'
import { RegisterService } from '../register.service'

export function registerFactory() {
  const prismaUserRepository = new PrismaUserRepository()
  const registerService = new RegisterService(prismaUserRepository)
  return registerService
}
