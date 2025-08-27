import { Gym, Prisma } from '@/generated/prisma'

export interface FindManyNearbyParams {
  latitude: number,
  longitude: number
}

export interface GymRepository {
  findById(userId: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchManyByTitle(query: string, page: number): Promise<Gym[]>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
}
