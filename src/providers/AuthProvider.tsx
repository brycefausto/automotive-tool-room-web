'use client'

import { AppUser } from '@/models/user'
import { store } from '@/store'
import { removeAppUser, setAppUser } from '@/store/reducers/user'
import serverFetch, { getBearerToken } from '@/utils/serverFetch'
import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter()
  const pathname = usePathname()
  const publicPaths = ["/login", "/forgotPassword", /resetPassword\/.*/]
  const isMatch = publicPaths.filter(path => pathname.match(path)).length > 0
  const protectedPath = !isMatch

  useEffect(() => {
    const token = getBearerToken()
    console.log({ token })
    if (protectedPath) {
      serverFetch.post('/auth/verify').then(({ data }) => {
        const user = data as AppUser | undefined

        if (user) {
          console.log({ authUser: user })
          store.dispatch(setAppUser(user))
        } else {
          store.dispatch(removeAppUser())
          router.push("/login")
        }
        console.log("loaded")
      }).catch((error: any) => {
        console.log(error.message)
        store.dispatch(removeAppUser())
        router.push("/login")
      })
    } else if (pathname == "/login" && token) {
      router.push("/")
    }
  })

  return (
    <>
      {children}
    </>
  )
}
