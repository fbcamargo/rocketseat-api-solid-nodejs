import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterService } from './register.service'
import { InMemoryUserRepository } from '@/repositories/in-memory/user.repository'
import { InMemoryGymRepository } from '@/repositories/in-memory/gym.repository'
import { GymService } from './gym.service'

let gymRepository: InMemoryGymRepository
let sut: GymService

describe('Register Service', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    sut = new GymService(gymRepository)
  })

  it('should be able to craete gym', async() => {
    const { gym } = await sut.create({
      title: 'Teste',
      description: 'Teste 1',
      phone: '99999999999',
      latitude: -22.07665,
      longitude: -51.4754105,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
