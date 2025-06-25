import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../routes/_erros/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch {
        throw new UnauthorizedError('Invalid auth token.')
      }
    }

    // validando se é membro da organização X
    request.getUserMembership = async (slug: string) => {
      const userId = await request.getCurrentUserId()
      const member = await prisma.member.findFirst({
        where: {
          userId,
          organization: {
            slug,
          },
        },
        include: {
          organization: true, // inclui a organização no resultado
        },
      })

      if (!member) {
        throw new UnauthorizedError(
          `You are not a member of this organization.`,
        )
      }

      const { organization, ...membership } = member

      return { organization, membership }
    }
  })
})

// adicionamos fastify-plugin para que o middleware possa ser registrado no Fastify, no escopo do projeto como um todo.
