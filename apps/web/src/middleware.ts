import { type NextRequest, NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // console.log('pathname', pathname)

  /**
   * Preciso pegar o cookie da rota para isso eu tenho que usar .next()
   * assim recebo o objeto inteiro da request e consigo pegar o cookie
   */
  const response = NextResponse.next()

  if (pathname.startsWith('/org')) {
    const [, , slug] = pathname.split('/')
    // console.log(slug)
    response.cookies.set('org', slug)
  } else {
    response.cookies.delete('org')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
