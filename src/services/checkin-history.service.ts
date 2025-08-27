
import { CheckIn } from '@/generated/prisma'
import { CheckInRepository } from '@/repositories/checkin.repository'

interface CheckInHistoryServiceRequest {
    userId: string,
    page: number
}

interface CheckInHistoryServiceResponse {
    checkIns: CheckIn[]
}

export class CheckInHistoryService {
  constructor(
    private checkInRepository: CheckInRepository,
  ) {}

  async findManyByUserId({
    userId,
    page,
  }: CheckInHistoryServiceRequest): Promise<CheckInHistoryServiceResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(userId, page)

    return {
      checkIns,
    }
  }
}
