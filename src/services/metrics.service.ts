
import { CheckIn } from '@/generated/prisma'
import { CheckInRepository } from '@/repositories/checkin.repository'

interface MetricServiceRequest {
    userId: string,
}

interface MetricServiceResponse {
    checkInsCount: number
}

export class MetricService {
  constructor(
    private checkInRepository: CheckInRepository,
  ) {}

  async countByUserId({
    userId,
  }: MetricServiceRequest): Promise<MetricServiceResponse> {
    const checkInsCount = await this.checkInRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
