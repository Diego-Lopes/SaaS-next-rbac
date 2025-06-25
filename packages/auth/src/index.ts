// casl se lê quésoul
import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user'
import { permission } from './permissions'
import { billingSubject } from './subjects/billing'
import { inviteSubject } from './subjects/invites'
import { organizationSubject } from './subjects/organization'
import { projectSubject } from './subjects/project'
import { userSubject } from './subjects/user'

export * from './models/organization'
export * from './models/project'
export * from './models/user'
export * from './roles'

const appAbilitySchema = z.union([
  projectSubject,
  userSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitySchema> // adicionar as demais subjects na appAbility

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

// no casl por padrão o usuário não pode fazer nada.

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permission[user.role] !== 'function') {
    // Verificando se existe uma função de permissão para o role do usuário
    throw new Error(`Nenhuma permissão encontrada para o role ${user.role}`)
  }

  // caso contrario passamos o role para a funcao de permissão
  permission[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename // estamos dizendo ao casl qual é a subject do projeto da models project.ts
    },
  })

  return ability
}
