import { PrismaUserRepository } from '@/repositories/prisma/user.repository'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error'
import { RegisterService } from '@/services/register.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().trim(),
    email: z.email(),
    password: z.string().min(8),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)
  try {
    const prismaUserRepository = new PrismaUserRepository()
    const registerService = new RegisterService(prismaUserRepository)

    await registerService.create({
      name,
      email,
      password,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
