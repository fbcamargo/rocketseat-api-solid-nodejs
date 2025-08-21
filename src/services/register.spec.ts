import { expect, describe, it } from 'vitest'
import { RegisterService } from './register.service'
import { PrismaUserRepository } from '@/repositories/prisma/user.repository'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/user.repository'
import { rejects } from 'assert'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Service', () => {
  it('should be able to registrer', async() => {
    const userRepository = new InMemoryUserRepository()
    const registerSevice = new RegisterService(userRepository)

    const { user } = await registerSevice.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async() => {
    const userRepository = new InMemoryUserRepository()
    const registerSevice = new RegisterService(userRepository)

    const { user } = await registerSevice.create({
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
    const userRepository = new InMemoryUserRepository()
    const registerSevice = new RegisterService(userRepository)

    const email = 'johndoe@example.com'

    await registerSevice.create({
      name: 'John Doe',
      email: email,
      password: '123456',
    })

    await expect( registerSevice.create({
      name: 'John Doe',
      email: email,
      password: '123456',
    }))
      .rejects
      .toBeInstanceOf(UserAlreadyExistsError)
  })
})
