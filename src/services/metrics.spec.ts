import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/checkin.repository'
import { MetricService } from './metrics.service'

let checkInsRepository: InMemoryCheckInRepository
let sut: MetricService

describe('Metric Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInRepository()
    sut = new MetricService(checkInsRepository)
  })

  it('should be able get check-ins count from metrics', async() => {
    for (let i = 1; i <= 2; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkInsCount } = await sut.countByUserId({
      userId: 'user-01',
    })

    console.log(checkInsCount)

    expect(checkInsCount).toEqual(2)
  })
})
