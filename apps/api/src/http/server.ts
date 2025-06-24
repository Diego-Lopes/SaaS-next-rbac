import fastifyCors from '@fastify/cors'
import fastifyjwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
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

import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'

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
  },
  transform: fastifyZodOpenApiTransform,
  transformObject: fastifyZodOpenApiTransformObject,
})

// Viabilizando uma interface para ver o swagger
app.register(fastifySwaggerUI, {
  routePrefix: '/docs', // meu endpoint para exibir a interface swagger.
})

// registrando cors
app.register(fastifyCors)

// registrando token jwt
app.register(fastifyjwt, {
  secret: 'Diegones',
})

// registrando as rotas
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)

app.listen({ port: 3333 }).then(() => {
  console.log('Server is running on port http://localhost:3333')
})
