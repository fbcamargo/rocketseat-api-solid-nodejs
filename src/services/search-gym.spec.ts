import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/gym.repository'
import { SearchGymService } from './search-gym.service'

let gymRepository: InMemoryGymRepository
let sut: SearchGymService

describe('Search Gym Service', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    sut = new SearchGymService(gymRepository)
  })

  it('should be able to search for gyms', async() => {
    await gymRepository.create({
      title: 'JavaScript Gym',
      description: 'Teste 1',
      phone: '99999999999',
      latitude: -22.07665,
      longitude: -51.4754105,
    })

    await gymRepository.create({
      title: 'Node Gym',
      description: 'Teste 1',
      phone: '99999999999',
      latitude: -22.07665,
      longitude: -51.4754105,
    })

    const { gyms } = await sut.searchManyByTitle({
      query: 'Node Gym',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Node Gym' }),
    ])
  })

  it('should be able to fetch paginated qyms seatch', async() => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `JavaScript Gym ${i}`,
        description: 'Teste 1',
        phone: '99999999999',
        latitude: -22.07665,
        longitude: -51.4754105,
      })
    }

    const { gyms } = await sut.searchManyByTitle({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ])
  })
})
