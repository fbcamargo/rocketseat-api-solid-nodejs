import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { Decimal } from '@/generated/prisma/runtime/library'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/checkin.repository'
import { InMemoryGymRepository } from '@/repositories/in-memory/gym.repository'
import { CheckInService } from './checkin.service'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInService

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-22.07665),
      longitude: new Decimal(-51.4754105),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async() => {
    const { checkIn } = await sut.create({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.07665,
      userLongitude: -51.4754105,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async() => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.create({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.07665,
      userLongitude: -51.4754105,
    })

    await expect(() =>
      sut.create({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.07665,
        userLongitude: -51.4754105,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async() => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.create({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.07665,
      userLongitude: -51.4754105,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.create({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.07665,
      userLongitude: -51.4754105,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distance gym', async() => {
    gymsRepository.create({
      id: 'gym-02',
      title: 'Node Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-22.104596),
      longitude: new Decimal(-51.4320636),
    })

    await expect( sut.create({
      gymId: 'gym-02',
      userId: 'user-01',
      userLatitude: -22.07665,
      userLongitude: -51.4754105,
    })).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
