import { ability } from '@saas/auth'

const useCanInviteSomeoneElse = ability.can('invite', 'all')

console.log(`Can invite someone else: ${useCanInviteSomeoneElse}`)

const useCannotDeleteOtherUsers = ability.cannot('delete', 'User')

console.log(`Cannot delete other users: ${useCannotDeleteOtherUsers}`)
