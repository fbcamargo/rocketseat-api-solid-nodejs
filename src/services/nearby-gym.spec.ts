import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/gym.repository'
import { NearbyGymService } from './nearby-gym.service'

let gymRepository: InMemoryGymRepository
let sut: NearbyGymService

describe('Nearby Gym Service', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    sut = new NearbyGymService(gymRepository)
  })

  it('should be able to fetch nearby gyms', async() => {
    await gymRepository.create({
      title: 'Near Gym',
      description: 'Teste 1',
      phone: '99999999999',
      latitude: -22.097743,
      longitude: -51.4382759,
    })

    await gymRepository.create({
      title: 'Far Gym',
      description: 'Teste 1',
      phone: '99999999999',
      latitude: -22.612676,
      longitude: -50.6738899,
    })

    const { gyms } = await sut.findManyNearby({
      userLatitude: -22.076650,
      userLongitude: -51.475410,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
    ])
  })
})
