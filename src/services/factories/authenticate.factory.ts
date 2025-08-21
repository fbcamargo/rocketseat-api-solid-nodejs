import { PrismaUserRepository } from '@/repositories/prisma/user.repository'
import { AuthenticateService } from '../authenticate.service'

export function authenticateFactory() {
  const prismaUserRepository = new PrismaUserRepository()
  const authenticateService = new AuthenticateService(prismaUserRepository)
  return authenticateService
}
