import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/checkin.repository'
import { CheckInHistoryService } from './checkin-history.service'

let checkInsRepository: InMemoryCheckInRepository
let sut: CheckInHistoryService

describe('CheckIn History Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInRepository()
    sut = new CheckInHistoryService(checkInsRepository)
  })

  it('should be able fetch check in history', async() => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.findManyByUserId({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
