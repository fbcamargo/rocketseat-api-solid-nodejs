import type { Gym, User } from '@/generated/prisma'
import { GymRepository } from '@/repositories/gym.repository'

interface NearbyGymServiceRequest {
    userLatitude: number,
    userLongitude: number
}

interface NearbyGymServiceResponse {
  gyms: Gym[]
}

export class NearbyGymService {
  constructor(private readonly gymRepository: GymRepository) {}

  async findManyNearby({
    userLatitude,
    userLongitude,
  } : NearbyGymServiceRequest): Promise<NearbyGymServiceResponse> {
    const gyms = await this.gymRepository
      .findManyNearby({
        latitude: userLatitude,
        longitude: userLongitude,
      })

    return {
      gyms,
    }
  }
}

