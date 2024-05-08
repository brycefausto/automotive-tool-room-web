// Use the client directive for using usePathname hook.
'use client'

import AppNavbar from '@/components/AppNavbar';
import AppSideBar from '@/components/AppSideBar';
import { PropsWithChildren } from 'react';

export const DashboardLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="flex h-screen overflow-hidden">
            <AppSideBar />
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <AppNavbar />
                <main>
                    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
};