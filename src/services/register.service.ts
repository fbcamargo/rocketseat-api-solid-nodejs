import { UserRepository } from '@/repositories/user.repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import type { User } from '@/generated/prisma'

interface RegisterServiceRequest {
    name: string
    email: string
    password: string
}

interface RegisterServiceResponse {
  user: User
}

export class RegisterService {
  constructor(private readonly userRepository: UserRepository) {}

  async create({
    name,
    email,
    password,
  } : RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const user = await this.userRepository
      .create({
        name,
        email,
        password: passwordHash,
      })

    return {
      user,
    }
  }
}

