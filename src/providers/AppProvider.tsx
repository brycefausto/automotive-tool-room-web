import { PropsWithChildren } from 'react'
import AuthProvider from './AuthProvider'
import StoreProvider from './StoreProvider'
import AlertModalProvider from './AlertModalProvider'
export default function AppProvider({ children }: PropsWithChildren) {

  return (
    <StoreProvider>
      <AuthProvider>
        <AlertModalProvider>
          {children}
        </AlertModalProvider>
      </AuthProvider>
    </StoreProvider>
  )
}
