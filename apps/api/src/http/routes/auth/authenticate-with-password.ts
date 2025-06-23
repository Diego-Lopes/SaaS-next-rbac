import { compare } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const createAccountBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/session/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticat with e-mail & password',
        body: createAccountBodySchema,
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as z.infer<
        typeof createAccountBodySchema
      >

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        return reply.status(400).send({ message: 'Invalid credentials.' })
      }

      /**
       * se nunca usou senha só login social
       */
      if (userFromEmail.passwordHash === null) {
        return reply
          .status(400)
          .send({ message: 'User does not have a password, use social login.' })
      }

      const isPasswordValid = await compare(
        password,
        userFromEmail.passwordHash,
      )

      if (!isPasswordValid) {
        return reply.status(400).send({ message: 'Invalid credentials.' })
      }

      // gerando o token jwt
      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(200).send({ token })
    },
  )
}
