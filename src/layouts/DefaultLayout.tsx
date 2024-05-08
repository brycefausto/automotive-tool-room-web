import React, { PropsWithChildren } from 'react'

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen flex-col justify-between">
      {children}
    </main>
  )
}
