import { cookies } from 'next/headers'

export async function isAuthenticated(): Promise<boolean> {
  return !!(await cookies()).get('token')?.value
}
