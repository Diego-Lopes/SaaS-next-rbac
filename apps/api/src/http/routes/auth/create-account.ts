/* eslint-disable prettier/prettier */
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_erros/bad-request-error'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new account.',
        body: createAccountBodySchema,
      },
    },
    async (request, reply) => {
      console.log(request.body)

      const { name, email, password } = request.body as z.infer<
        typeof createAccountBodySchema
      >

      /**
       * Verificar se o domínio do email é de uma organização existente
       * se sim, adicioná-lo automáticamente a essa organização.
       */
      const [, domain] = email.split('@')

      const autoJoinOrganization = await prisma.organization.findFirst({
        where: {
          domain,
          shouldAttachUsersByDomain: true,
        },
      })

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (userWithSameEmail) {
        throw new BadRequestError('User with same e-mail already exists.')
      }

      const passwordHash = await hash(password, 6)

      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          // prisma permite fazer encadeamento de ação
          member_on: autoJoinOrganization // member_on é um relacionamento
            ? {
              create: {
                organizationId: autoJoinOrganization.id,
              },
            }
            : undefined,
        },
      })

      return reply.status(201).send()
    },
  )
}
