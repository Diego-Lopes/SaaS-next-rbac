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
import { createOrganization } from './routes/orgs/create-organization'
import { getMembership } from './routes/orgs/get-membership'
import { getOrganization } from './routes/orgs/get-organization'
import { getOrganizations } from './routes/orgs/get-organizations'

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

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(
    `🎉 Server is running on port http://localhost:${env.SERVER_PORT} 🔥🔥`,
  )
})
