import { organizationSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_erros/unauthorized-error'

const paramsOrganizationSchema = z.object({
  slug: z.string(),
})

export async function shutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organization/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Shutdown organization',
          security: [{ bearerAuth: [] }],
          // body: updateOrganizatioSchema,
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

        // Obtendo a organização baseado no organizationSchema
        // como o objeto organization já é do tipo Organization iguais então passo o objeto e o zod utiliza o que precisa
        const authOrganization = organizationSchema.parse(organization)

        // validando permissões com casl
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authOrganization)) {
          throw new UnauthorizedError(
            "You're not allowed to shutdown this organization.",
          )
        }

        await prisma.organization.delete({
          where: {
            id: organization.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
