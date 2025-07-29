import { getCurrentOrg } from '@/auth/auth'

import { Navlink } from './nav-link'
import { Button } from './ui/button'

export async function Tabs() {
  const currentOrg = await getCurrentOrg()

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        <Button
          asChild
          variant={'ghost'}
          size={'sm'}
          className="data-[current=true]:border-input text-muted-foreground data-[current=true]:text-foreground border border-transparent"
        >
          <Navlink href={`/org/${currentOrg}`}>Projects</Navlink>
        </Button>
        <Button
          asChild
          variant={'ghost'}
          size={'sm'}
          className="data-[current=true]:border-input text-muted-foreground data-[current=true]:text-foreground border border-transparent"
        >
          <Navlink href={`/org/${currentOrg}/members`}>Members</Navlink>
        </Button>
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
      </nav>
    </div>
  )
}
