import { Button, ButtonProps } from 'flowbite-react'
import Link from 'next/link'

export default function LinkButton({ href, children, ...props }: ButtonProps & { href: string }) {
  return (
    <Button className="flex" as={Link} href={href} {...props}>
      {children}
    </Button>
  )
}
