import { PrismaUserRepository } from '@/repositories/prisma/user.repository'
import { AuthenticateService } from '@/services/authenticate.service'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error'
import { authenticateFactory } from '@/services/factories/authenticate.factory'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.email(),
    password: z.string().min(8),
  })

  const { email, password } = registerBodySchema.parse(request.body)
  try {
    const authenticateService = authenticateFactory()

    await authenticateService.create({
      email,
      password,
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }

  return reply.status(200).send()
}
