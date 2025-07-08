/**
 * cookies-next ele funciona tando do lado cliente quanto server
 */
import { env } from '@saas/env'
import { type CookiesFn, getCookie } from 'cookies-next'
import ky from 'ky'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let cookieStore: CookiesFn | undefined

        if (typeof window === 'undefined') {
          // lado servidor
          const { cookies: serverCookies } = await import('next/headers')

          cookieStore = serverCookies
        }

        // lado cliente
        const token = await getCookie('token', { cookies: cookieStore })

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})
