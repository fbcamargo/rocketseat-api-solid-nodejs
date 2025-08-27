
import { CheckIn } from '@/generated/prisma'
import { CheckInRepository } from '@/repositories/checkin.repository'
import { GymRepository } from '@/repositories/gym.repository'
import { ResourceNotFoundError } from './errors/resource-not-fountd-error'
import { getDistanceBetweenCordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins'
import dayjs from 'dayjs'
import { LateCheckinError } from './errors/late-checkin-error'

interface ValidateCheckInServiceRequest {
    checkInId: string
}

interface ValidateCheckInServiceResponse {
    checkIn: CheckIn
}

export class ValidateCheckInService {
  constructor(private checkInRepository: CheckInRepository) {}

  async create({
    checkInId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) { // 20 minutes
      throw new LateCheckinError()
    }

    checkIn.validated_at = new Date()

    await this.checkInRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
