import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getProfile } from '@/http/get-profile'

export async function isAuthenticated(): Promise<boolean> {
  return !!(await cookies()).get('token')?.value
}

export async function auth() {
  const token = await cookies()
  const hasToken = token.get('token')?.value

  if (!hasToken) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch (error) {
    console.error(error)
  }

  redirect('/api/auth/sign-out')
  /**
   * redirecionando para uma rota api para limpar o cookies, por causa desse função rodar componente serve
   */
}
