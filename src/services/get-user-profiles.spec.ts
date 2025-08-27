import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/user.repository'
import { GetUserProfilesService } from './get-user-profiles.service'
import { ResourceNotFoundError } from './errors/resource-not-fountd-error'

let userRepository: InMemoryUserRepository
let sut: GetUserProfilesService

describe('Get User Profile Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new GetUserProfilesService(userRepository)
  })

  it('should be able to get user profile', async() => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
    })

    const { user } = await sut.findById({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('John Doe')
  })

  it('should be able to get user profile with wrong id', async() => {
    await expect(
      () => sut.findById({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
