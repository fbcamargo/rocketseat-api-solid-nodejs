import type { Gym, User } from '@/generated/prisma'
import { GymRepository } from '@/repositories/gym.repository'

interface GymServiceRequest {
    title: string
    description?: string | null
    phone: string | null,
    latitude: number,
    longitude: number
}

interface GymServiceResponse {
  gym: Gym
}

export class GymService {
  constructor(private readonly gymRepository: GymRepository) {}

  async create({
    title,
    description,
    phone,
    latitude,
    longitude,
  } : GymServiceRequest): Promise<GymServiceResponse> {
    const gym = await this.gymRepository
      .create({
        title,
        description,
        phone,
        latitude,
        longitude,
      })

    return {
      gym,
    }
  }
}

