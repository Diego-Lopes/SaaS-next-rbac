import { organizationSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_erros/bad-request-error'
import { UnauthorizedError } from '../_erros/unauthorized-error'

const transferOrganizatioSchema = z.object({
  transferToUserId: z.string().uuid(),
})

const paramsOrganizationSchema = z.object({
  slug: z.string(),
})

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Transfer organization ownership',
          security: [{ bearerAuth: [] }],
          body: transferOrganizatioSchema,
          params: paramsOrganizationSchema,
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params as z.infer<
          typeof paramsOrganizationSchema
        >
        const userId = await request.getCurrentUserId()

        const { membership, organization } =
          await request.getUserMembership(slug)

        // verifica se o usuário tem permissão de atualizar a organização

        // Obtendo a organização baseado no organizationSchema
        // como o objeto organization já é do tipo Organization iguais então passo o objeto e o zod utiliza o que precisa
        const authOrganization = organizationSchema.parse(organization)

        // validando permissões com casl
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('transfer_owership', authOrganization)) {
          throw new UnauthorizedError(
            "You're not allowed to transfer this organization ownership.",
          )
        }

        const { transferToUserId } = request.body as z.infer<
          typeof transferOrganizatioSchema
        >

        // Podemos transferir para o usuário que não pertence a organização? NÃO!
        // Então vamos verificar se o usuário faz parte da organização
        const transferToMembership = await prisma.member.findUnique({
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: transferToUserId,
            },
          },
        })
        // não seja membro da organização então retorna um erro.
        if (!transferToMembership) {
          throw new BadRequestError(
            'Target user is not a member of this organization.',
          )
        }

        // verificado que o usuário é membro, continuar com a lógica de transferência.
        // Como são dois pontos distinto vamos usar o $transactio para garantir se uma falhar a outre falhe também.
        await prisma.$transaction([
          // Quando for fazer a transferência temos que forçar a role dele para ADMIN
          prisma.member.update({
            where: {
              organizationId_userId: {
                organizationId: organization.id,
                userId: transferToUserId,
              },
            },
            data: {
              role: 'ADMIN',
            },
          }),
          // atualizar a organização
          prisma.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              ownerId: transferToUserId,
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}
