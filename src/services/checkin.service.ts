
import { CheckIn } from '@/generated/prisma'
import { CheckInRepository } from '@/repositories/checkin.repository'
import { GymRepository } from '@/repositories/gym.repository'
import { ResourceNotFoundError } from './errors/resource-not-fountd-error'
import { getDistanceBetweenCordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins'

interface CheckInServiceRequest {
    userId: string,
    gymId: string
    userLatitude: number,
    userLongitude: number
}

interface CheckInServiceResponse {
    checkIn: CheckIn
}

export class CheckInService {
  constructor(
    private checkInRepository: CheckInRepository,
    private gymRepository: GymRepository,
  ) {}

  async create({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
