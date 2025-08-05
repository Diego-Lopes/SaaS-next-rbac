import { z } from 'zod'
// só salvamos coisas importantes para parte de permissionamento do projeto.
export const organizationSchema = z.object({
  __typename: z.literal('Organization').default('Organization'), // na hora de criar o projeto preencher como padrão
  id: z.string(),
  ownerId: z.string(),
})
export type Organization = z.infer<typeof organizationSchema>
