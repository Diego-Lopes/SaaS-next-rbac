// criando as permissões, definir

import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permission: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all') // por padrão o admin pode gerenciar tudo.

    cannot(['transfer_owership', 'update'], 'Organization') // não pode transferir organização e nem a própria organização
    can(['transfer_owership', 'update'], 'Organization', {
      ownerId: { $eq: user.id },
    }) // pode tranferir uma organização que ele é dono.
  },
  MEMBER(user, { can }) {
    can('get', 'User')
    can(['create', 'get'], 'Project')
    can(['update', 'delete'], 'Project', { ownerId: { $eq: user.id } })
  },
  BILLING(_, { can }) {
    can('manage', 'Billing')
  },
}
