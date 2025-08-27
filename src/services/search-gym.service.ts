import type { Gym, User } from '@/generated/prisma'
import { GymRepository } from '@/repositories/gym.repository'

interface SearchGymServiceRequest {
    query: string
    page: number
}

interface SearchGymServiceResponse {
  gyms: Gym[]
}

export class SearchGymService {
  constructor(private readonly gymRepository: GymRepository) {}

  async searchManyByTitle({
    query,
    page,
  } : SearchGymServiceRequest): Promise<SearchGymServiceResponse> {
    const gyms = await this.gymRepository
      .searchManyByTitle(query, page)

    return {
      gyms,
    }
  }
}

