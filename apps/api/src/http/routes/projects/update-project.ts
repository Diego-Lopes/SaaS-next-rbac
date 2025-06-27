import { projectSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_erros/bad-request-error'
import { UnauthorizedError } from '../_erros/unauthorized-error'

const paramsSchema = z.object({
  slug: z.string(),
  projectId: z.string().uuid(),
})

const updateProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
})

export async function updateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organization/:slug/projects/:projectId',
      {
        schema: {
          tags: ['projects'],
          summary: 'Update a project',
          security: [{ bearerAuth: [] }],
          params: paramsSchema,
          body: updateProjectSchema,
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params as z.infer<
          typeof paramsSchema
        >
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        // verificando se o projeto existe e é da organização atual.
        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found')
        }

        const { cannot } = getUserPermissions(userId, membership.role)
        const authProject = projectSchema.parse(project)

        if (cannot('update', authProject)) {
          throw new UnauthorizedError(
            `You're not allowed to update this project.`,
          )
        }

        const { name, description } = request.body as z.infer<
          typeof updateProjectSchema
        >

        await prisma.project.update({
          where: {
            id: projectId,
          },
          data: {
            name,
            description,
          },
        })

        return reply.status(204).send()
      },
    )
}
