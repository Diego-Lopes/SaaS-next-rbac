import { redirect } from 'next/navigation'

import { isAuthticated } from '@/auth/auth'

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (await isAuthticated()) {
    // redirecionando caso tiver token nos cookies!!!
    redirect('/') // redirect usa-se em client server
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xs"> {children}</div>
    </div>
  )
}
