/* eslint-disable require-await */
import { Prisma, User } from '@/generated/prisma'
import { UserRepository } from '../user.repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUserRepository implements UserRepository {
  public itens: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      created_at: new Date(),
    }

    this.itens.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.itens.find((item) => item.email === email)
    if (!user) {
      return null
    }
    return user
  }

}
