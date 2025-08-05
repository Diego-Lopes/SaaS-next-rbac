import { ability, getCurrentOrg } from '@/auth/auth'

import { Navlink } from './nav-link'
import { Button } from './ui/button'

export async function Tabs() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')

  const canGetMembers = permissions?.can('get', 'User')
  const canGetProjects = permissions?.can('get', 'Project')

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        {canGetProjects && (
          <Button
            asChild
            variant={'ghost'}
            size={'sm'}
            className="data-[current=true]:border-input text-muted-foreground data-[current=true]:text-foreground border border-transparent"
          >
            <Navlink href={`/org/${currentOrg}`}>Projects</Navlink>
          </Button>
        )}
        {canGetMembers && (
          <Button
            asChild
            variant={'ghost'}
            size={'sm'}
            className="data-[current=true]:border-input text-muted-foreground data-[current=true]:text-foreground border border-transparent"
          >
            <Navlink href={`/org/${currentOrg}/members`}>Members</Navlink>
          </Button>
        )}
        {(canUpdateOrganization || canGetBilling) && (
          <Button
            asChild
            variant={'ghost'}
            size={'sm'}
            className="data-[current=true]:border-input text-muted-foreground data-[current=true]:text-foreground border border-transparent"
          >
            <Navlink href={`/org/${currentOrg}/settings`}>
              Settings & Billing
            </Navlink>
          </Button>
        )}
      </nav>
    </div>
  )
}
