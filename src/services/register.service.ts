import { prisma } from '@/lib/prisma'
import { UserRepository } from '@/repositories/user.repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterServiceRequest {
    name: string
    email: string
    password: string
}

export class RegisterService {
  constructor(private readonly userRepository: UserRepository) {}

  async create({ name, email, password } : RegisterServiceRequest) {
    const userWithSameEmail = await this.userRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    await this.userRepository.create({ name, email, password: passwordHash })
  }
}

