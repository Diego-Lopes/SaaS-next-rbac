import './globals.css'

import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'Create Next App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressContentEditableWarning>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute={'class'}
          defaultTheme="dark"
          disableTransitionOnChange // trocar a cor sem animação, ativa é troca bruta, seca.
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
