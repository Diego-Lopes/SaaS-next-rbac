import { cookies } from 'next/headers'

export async function isAuthticated(): Promise<boolean> {
  return !!(await cookies()).get('token')?.value
}
