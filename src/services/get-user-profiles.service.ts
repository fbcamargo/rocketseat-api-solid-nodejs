import { UserRepository } from '@/repositories/user.repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@/generated/prisma'
import { ResourceNotFoundError } from './errors/resource-not-fountd-error'

interface GetUserProfilesServiceRequest {
  userId: string
}

interface GetUserProfilesServiceResponse {
  user: User
}

export class GetUserProfilesService {
  constructor(private userRepository: UserRepository) {}

  async findById({
    userId,
  }: GetUserProfilesServiceRequest): Promise<GetUserProfilesServiceResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
