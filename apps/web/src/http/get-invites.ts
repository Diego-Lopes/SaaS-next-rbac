import type { Role } from '@saas/auth'

import { api } from './api-client'

interface GetProjectResponse {
  invites: {
    id: string
    role: Role
    email: string
    createdAt: string
    author: {
      id: string
      name: string | null
    } | null
  }[]
}

export async function getInvites(org: string) {
  const result = await api
    .get(`organization/${org}/invites`, {
      next: {
        tags: [`${org}/invites`],
      },
    })
    .json<GetProjectResponse>()

  return result
}
