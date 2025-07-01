import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { signInWithGithub } from '@/http/sign-in-with-github'

export async function GET(request: NextRequest) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      {
        message: 'Github OAuth code was not found.',
      },
      {
        status: 400,
      },
    )
  }

  const { token } = await signInWithGithub({ code })

  const cookie = await cookies()
  cookie.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  })

  const redirectURL = request.nextUrl.clone()
  redirectURL.pathname = '/'
  redirectURL.search = ''

  return NextResponse.redirect(redirectURL)
}
