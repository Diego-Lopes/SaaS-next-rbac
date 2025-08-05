import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const redirectURL = request.nextUrl.clone()
  redirectURL.pathname = '/auth/sign-in'

  const cookie = await cookies()
  cookie.delete('token')

  return NextResponse.redirect(redirectURL)
}
