import fastifyCors from '@fastify/cors'
import fastifyjwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { env } from '@saas/env'
import { fastify } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-zod-openapi'
import { ZodOpenApiVersion } from 'zod-openapi'

import { errorHandler } from './error-handler'
import { authenticateWithGithub } from './routes/auth/authenticate-with-github'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecorver } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { acceptInvite } from './routes/invites/accept-invite'
import { createInvite } from './routes/invites/create-invite'
import { getInvite } from './routes/invites/get-invite'
import { getInvites } from './routes/invites/get-invites'
import { getPendingInvites } from './routes/invites/get-pending-invites'
import { rejectInvite } from './routes/invites/reject-invites'
import { revokeInvite } from './routes/invites/revoke-invite'
import { getMembers } from './routes/members/get-members'
import { removeMember } from './routes/members/remove-member'
import { updateMember } from './routes/members/update-member'
import { createOrganization } from './routes/orgs/create-organization'
import { getMembership } from './routes/orgs/get-membership'
import { getOrganization } from './routes/orgs/get-organization'
import { getOrganizations } from './routes/orgs/get-organizations'
import { shutdownOrganization } from './routes/orgs/shutdown-organization'
import { transferOrganization } from './routes/orgs/transfer-organization'
import { updateOrganization } from './routes/orgs/update-organization'
import { createProject } from './routes/projects/create-project'
import { deleteProject } from './routes/projects/delete-project'
import { getProject } from './routes/projects/get-project'
import { getProjects } from './routes/projects/get-projects'
import { updateProject } from './routes/projects/update-project'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler) // serialaização dos dados com zod. Entrada e saída dos dados via http.
app.setValidatorCompiler(validatorCompiler) // fastify vai fazer validação dos dados com zod.

app.register(fastifyZodOpenApiPlugin)

// adicionando swagger
/** Este fastifySwagger ele gera um json e pode ser usado em outras ferramentas
 * tais como swaggerhub...
 */
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack app with multi-tenant & RBAC',
      version: '1.0.0',
    },
    openapi: '3.0.3' satisfies ZodOpenApiVersion,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: fastifyZodOpenApiTransform,
  transformObject: fastifyZodOpenApiTransformObject,
})

// adicionando error handler
app.setErrorHandler(errorHandler)

// Viabilizando uma interface para ver o swagger
app.register(fastifySwaggerUI, {
  routePrefix: '/docs', // meu endpoint para exibir a interface swagger.
})

// registrando cors
app.register(fastifyCors)

// registrando token jwt
app.register(fastifyjwt, {
  secret: env.JWT_SECRET,
})

// registrando as rotas
// routes Auth
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(requestPasswordRecorver)
app.register(resetPassword)
app.register(authenticateWithGithub)

// routes Org
app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)

// routes Project
app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)

// routes Membres
app.register(getMembers)
app.register(updateMember)
app.register(removeMember)

// routes Invite
app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(acceptInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(
    `🎉 Server is running on port http://localhost:${env.SERVER_PORT} 🔥🔥`,
  )
})
