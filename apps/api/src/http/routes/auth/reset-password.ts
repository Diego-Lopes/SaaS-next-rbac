import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../_erros/unauthorized-error'

const requestPasswordRecoverBodySchema = z.object({
  code: z.string(),
  password: z.string().min(6),
})

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request password reset',
        body: requestPasswordRecoverBodySchema,
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { code, password } = (await request.body) as z.infer<
        typeof requestPasswordRecoverBodySchema
      >

      const tokenFromCode = await prisma.token.findUnique({
        where: { id: code },
      })

      if (!tokenFromCode) {
        throw new UnauthorizedError('Invalid or expired recovery code.')
      }

      const passwordHash = await hash(password, 6)

      await prisma.user.update({
        where: {
          id: tokenFromCode.userId,
        },
        data: {
          passwordHash,
        },
      })

      return reply.status(204).send()
    },
  )
}
