import { FastifyInstance } from 'fastify'
import { registerController } from './controllers/register.controller'

// eslint-disable-next-line require-await
export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerController)
}
