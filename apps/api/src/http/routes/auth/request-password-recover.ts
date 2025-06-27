import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const requestPasswordRecoverBodySchema = z.object({
  email: z.string().email(),
})

export async function requestPasswordRecorver(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request password recovery',
        body: requestPasswordRecoverBodySchema,
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = (await request.body) as z.infer<
        typeof requestPasswordRecoverBodySchema
      >

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        // Não informar se o usuário não existe, para evitar vazamento de informações
        // apenas retorner sucesso para não informar se o usuário existe ou não
        return reply.status(201).send()
      }

      const { id: code } = await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVER',
          userId: userFromEmail.id,
        },
      })

      // Aqui você deve enviar o e-mail com o link de recuperação de senha
      // Exemplo de envio de e-mail (você deve implementar isso):
      // await sendPasswordRecoverEmail({
      //   to: email,
      //   code,
      // })
      console.log(`Password recovery code: ${code}`)
      return reply.status(201).send()
    },
  )
}
