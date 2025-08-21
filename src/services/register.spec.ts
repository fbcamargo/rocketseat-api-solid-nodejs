import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterService } from './register.service'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/user.repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let userRepository: InMemoryUserRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new RegisterService(userRepository)
  })

  it('should be able to registrer', async() => {
    const { user } = await sut.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async() => {
    const { user } = await sut.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async() => {
    const email = 'johndoe@example.com'

    await sut.create({
      name: 'John Doe',
      email: email,
      password: '123456',
    })

    await expect( sut.create({
      name: 'John Doe',
      email: email,
      password: '123456',
    }))
      .rejects
      .toBeInstanceOf(UserAlreadyExistsError)
  })
})
