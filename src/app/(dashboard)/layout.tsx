import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
