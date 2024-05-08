import DefaultLayout from '@/layouts/DefaultLayout'
import React, { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <DefaultLayout>
      {children}
    </DefaultLayout>
  )
}
