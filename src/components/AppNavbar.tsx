'use client'
import { useAppSelector } from '@/store';
import { getStoredToken } from '@/store/reducers/messaging';
import { getAppUser } from '@/store/reducers/user';
import { clearStorageItem } from '@/utils';
import serverFetch from '@/utils/serverFetch';
import { Avatar, Button, Dropdown, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdGetApp } from "react-icons/md";
import APKQRCodeModal from './APKQRCodeModal';
import MessagingComponent from './MessagingComponent';
import NotificationBell from './NotificationBell';
import Image from 'next/image';

export interface AppNavbarProps {
  onToggleSidebar: () => void
}

export default function AppNavbar({ onToggleSidebar }: AppNavbarProps) {
  const router = useRouter()
  const user = useAppSelector(getAppUser)
  const [loaded, setLoaded] = useState(false);
  const [apkDialogShow, setApkDialogShow] = useState(false);
  const storedToken = useAppSelector(getStoredToken)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const handleLogout = async () => {
    await serverFetch.post('/auth/logout', { messagingToken: storedToken })
    clearStorageItem('access_token')
    router.push('/login')
  }
  return (
    <Navbar fluid rounded className="bg-slate-100">
      <button
        data-drawer-target="app-sidebar"
        data-drawer-toggle="app-sidebar"
        aria-controls="app-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 mb-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={() => onToggleSidebar()}
        >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>
      <NavbarBrand as={Link} href="/">
        <Image src="/Automotive Logo.png" className="mr-3 lg:hidden" alt="App Logo" width={40} height={40} />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Automotive Tool Room Management</span>
      </NavbarBrand>
      <div className="flex flex-auto md:order-2 justify-end">
        <div className="mr-2">
          <Button onClick={() => setApkDialogShow(!apkDialogShow)}>
            <MdGetApp className="mr-2" />
            Download App
          </Button>
          <APKQRCodeModal show={apkDialogShow} setShow={setApkDialogShow} />
        </div>
        {/* <Button className="mx-2" onClick={async () => {
          await serverFetch.post(`/messaging/testMessage`);
        }}>
          Test Notif
        </Button> */}
        <NotificationBell />
        {loaded && (
          <>
            {user.loggedIn && (
              <MessagingComponent />
            )}
            <div className="mx-2 flex items-center">
              <span className="block font-medium text-md">{user.name}</span>
            </div>
          </>
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
      </div>
    </Navbar>
  );
}
