import { organizationSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_erros/bad-request-error'
import { UnauthorizedError } from '../_erros/unauthorized-error'

const updateOrganizatioSchema = z.object({
  name: z.string(),
  domain: z.string().nullish(),
  shouldAttachUsersByDomain: z.boolean().optional(),
})

const paramsOrganizationSchema = z.object({
  slug: z.string(),
})

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organization/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Update organizaton details',
          security: [{ bearerAuth: [] }],
          body: updateOrganizatioSchema,
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

        const { name, domain, shouldAttachUsersByDomain } =
          request.body as z.infer<typeof updateOrganizatioSchema>

        // verifica se o usuário tem permissão de atualizar a organização

        // Obtendo a organização baseado no organizationSchema
        // como o objeto organization já é do tipo Organization iguais então passo o objeto e o zod utiliza o que precisa
        const authOrganization = organizationSchema.parse(organization)

        // validando permissões com casl
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError(
            "You're not allowed to update this organization.",
          )
        }

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: {
              domain,
              id: {
                not: organization.id, // não pode ser a própria organização
              },
            },
          })

          if (organizationByDomain) {
            throw new BadRequestError(
              'Another organization with same domanin already exists.',
            )
          }
        }

        await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            name,
            domain,
            shouldAttachUsersByDomain,
          },
        })

        return reply.status(204).send()
      },
    )
}
