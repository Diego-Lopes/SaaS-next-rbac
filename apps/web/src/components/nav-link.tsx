'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

interface NavlinkProps extends ComponentProps<typeof Link> {}

export function Navlink(props: NavlinkProps) {
  const pathName = usePathname()

  const isCurrent = props.href.toString() === pathName

  return <Link data-current={isCurrent} {...props} />
}
