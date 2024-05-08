'use client'
import { getMessagingToken } from '@/config/firebase-messaging';
import { useAppDispatch, useAppSelector } from '@/store';
import { getStoredToken, setStoredToken } from '@/store/reducers/messaging';
import { getAppUser } from '@/store/reducers/user';
import { clearStorageItem } from '@/utils';
import serverFetch from '@/utils/serverFetch';
import { Avatar, Dropdown, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotificationBell from './NotificationBell';
import Image from 'next/image';

export default function AppNavbar() {
  const router = useRouter()
  const user = useAppSelector(getAppUser)
  const [loaded, setLoaded] = useState(false);
  const storedToken = useAppSelector(getStoredToken)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setLoaded(true)
    if (!storedToken) {
      getMessagingToken().then((token) => {
        if (token) {
          dispatch(setStoredToken(token))
        }
      })
    }
  }, [])

  const handleLogout = async () => {
    await serverFetch.post('/auth/logout', { messagingToken: storedToken })
    clearStorageItem('access_token')
    router.push('/login')
  }
  return (
    <Navbar fluid rounded className="bg-slate-100">
      <NavbarBrand as={Link} href="/">
        <Image src="/Automotive Logo.png" className="mr-3 md:hidden lg:hidden sm:h-20" alt="App Logo" width={20} height={20} />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Automotive Tool Room Management</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <NotificationBell />
        {loaded && (
          <div className="mx-2 flex items-center">
            <span className="block font-medium text-md">{user.name}</span>
          </div>
        )}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="/profile_placeholder.jpg" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{user.name}</span>
            <span className="block truncate text-sm font-medium">{user.email}</span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={handleLogout}
          >
            Log out
          </Dropdown.Item>
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        {/* <NavbarLink href="#" active>
          Home
        </NavbarLink>
        <NavbarLink as={Link} href="#">
          About
        </NavbarLink> */}
      </NavbarCollapse>
    </Navbar>
  );
}
