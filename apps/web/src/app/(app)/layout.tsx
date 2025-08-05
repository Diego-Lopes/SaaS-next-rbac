import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

export default async function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  if (!(await isAuthenticated())) {
    // redirecionando caso tiver token nos cookies!!!
    redirect('/auth/sign-in') // redirect usa-se em client server
  }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}
