import { Crown } from 'lucide-react'
import Image from 'next/image'

import { getCurrentOrg } from '@/auth/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getMembers } from '@/http/get-members'
import { getMembership } from '@/http/get-membership'
import { getOrganization } from '@/http/get-organization'

export async function MemberList() {
  const currentOrg = await getCurrentOrg()

  const [{ members }, { membership }, { organization }] = await Promise.all([
    getMembers(currentOrg!),
    getMembership(currentOrg!),
    getOrganization(currentOrg!),
  ])
  // vídeo time 02:59
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell className="py-2.5" style={{ width: 48 }}>
                    <Avatar>
                      <AvatarFallback />
                      {member.avatarUrl && (
                        <Image
                          src={member.avatarUrl}
                          width={32}
                          height={32}
                          alt=""
                          className="aspect-square size-full"
                        />
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {member.name}
                        {member.userId === membership.userId && ' (me)'}
                        {organization.ownerId === member.userId && (
                          <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                            <Crown className="size-3" /> Owner
                          </span>
                        )}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {member.email}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
