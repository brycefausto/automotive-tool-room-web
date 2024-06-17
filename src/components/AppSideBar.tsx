/* eslint-disable @next/next/no-img-element */
'use client';

import { Transition } from '@headlessui/react';
import { Sidebar, SidebarItemProps } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPrescriptionBottle, FaRegListAlt, FaTools } from "react-icons/fa";
import { HiChartPie, HiUser } from 'react-icons/hi';
import { HiListBullet } from "react-icons/hi2";
import { IoMdChatbubbles } from "react-icons/io";
import { MdSubject } from "react-icons/md";
import { RiOrganizationChart } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";

const LinkSidebarItem = ({ children, href, ...props }: SidebarItemProps & { href: string }) => {
  return (
    <Link href={href}>
      <Sidebar.Item {...props} as="div">
        {children}
      </Sidebar.Item>
    </Link>
  )
}

export interface AppSideBarProps {
  show: boolean
}

export default function AppSideBar({ show }: AppSideBarProps) {
  return (
    <Transition
      show={show}
      enter="transition ease-in-out duration-300 transform"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition ease-in-out duration-300 transform"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full">
      <div>
        <Sidebar>
          <div className="mb-5 flex items-center">
            <Image src="/Automotive Logo.png" className="md:h-20 lg:h-20 mr-3" alt="App Logo" width={80} height={80} priority={true} />
            <div>
              <div className="self-center font-semibold dark:text-white text-center">
                Automotive Tool Room Management
              </div>
            </div>
          </div>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <LinkSidebarItem href="/" icon={HiChartPie}>
                Dashboard
              </LinkSidebarItem>
              <Sidebar.Collapse icon={HiListBullet} label="Items">
                <LinkSidebarItem href="/items" icon={HiListBullet}>All Items</LinkSidebarItem>
                <LinkSidebarItem href="/items?category=tool" icon={FaTools}>Tools</LinkSidebarItem>
                <LinkSidebarItem href="/items?category=consumable" icon={FaPrescriptionBottle}>Consumables</LinkSidebarItem>
              </Sidebar.Collapse>
              <LinkSidebarItem href="/users" icon={HiUser}>
                Users
              </LinkSidebarItem>
              <LinkSidebarItem href="/departments" icon={RiOrganizationChart}>
                Departments
              </LinkSidebarItem>
              <LinkSidebarItem href="/sections" icon={SiGoogleclassroom}>
                Sections
              </LinkSidebarItem>
              <LinkSidebarItem href="/subjects" icon={MdSubject}>
                Subjects
              </LinkSidebarItem>
              <LinkSidebarItem href="/transactions" icon={FaRegListAlt}>
                Transactions
              </LinkSidebarItem>
              <LinkSidebarItem href="/chat" icon={IoMdChatbubbles}>
                Chat
              </LinkSidebarItem>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </Transition>
  );
}
