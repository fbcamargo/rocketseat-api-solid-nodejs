/* eslint-disable require-await */
import { Gym, Prisma } from '@/generated/prisma'
import { FindManyNearbyParams, GymRepository } from '../gym.repository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymRepository implements GymRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id)
    if (!gym) {
      return null
    }
    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async searchManyByTitle(query: string, page: number): Promise<Gym[]> {
    return this.items.filter((item) =>
      item.title.includes(query))
      .splice((page - 1) * 20, page * 20)
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )
      return distance < 10
    })
  }
}
