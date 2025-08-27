import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/user.repository'
import { AuthenticateService } from './authenticate.service'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let userRepository: InMemoryUserRepository
let sut: AuthenticateService

describe('Register Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new AuthenticateService(userRepository)
  })

  it('should be able to authenticate', async() => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
    })

    const { user } = await sut.create({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate with wrong email', async() => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
    })

    await expect(() =>
      sut.create({
        email: 'johndoe@example.wrong.com',
        password: '1234567',
      }))
      .rejects
      .toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate with wrong password', async() => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
    })

    await expect(() =>
      sut.create({
        email: 'johndoe@example.com',
        password: '1234567',
      }))
      .rejects
      .toBeInstanceOf(InvalidCredentialsError)
  })
})
