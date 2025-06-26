import { z } from 'zod'
// só salvamos coisas importantes para parte de permissionamento do projeto.
export const projectSchema = z.object({
  __typename: z.literal('Project').default('Project'), // na hora de criar o projeto preencher como padrão
  id: z.string(),
  ownerId: z.string(),
})
export type Project = z.infer<typeof projectSchema>
