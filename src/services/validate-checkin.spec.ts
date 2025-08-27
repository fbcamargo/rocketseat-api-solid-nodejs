import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/checkin.repository'
import { ValidateCheckInService } from './validate-checkin.service'
import { ResourceNotFoundError } from './errors/resource-not-fountd-error'

let checkInsRepository: InMemoryCheckInRepository
let sut: ValidateCheckInService

describe('Validate CheckIn Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInRepository()
    sut = new ValidateCheckInService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async() => {
    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await sut.create({
      checkInId: checkIn.id,
    })

    expect(checkIn.validated_at)
      .toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at)
      .toEqual(expect.any(Date))
  })

  it('should be not be able to validate the check-in', async() => {
    await expect(() => sut.create({
      checkInId: 'inexistent-checkin-id',
    }))
      .rejects
      .toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be not be able to validate the check-in after 20 minutes of its creation', async() => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) // utc-3

    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twenyOneMinutesInMs = 1000 * 60 * 21 // 21 min

    vi.advanceTimersByTime(twenyOneMinutesInMs)

    await expect(() => sut.create({
      checkInId: checkIn.id,
    }))
      .rejects
      .toBeInstanceOf(Error)
  })
})
