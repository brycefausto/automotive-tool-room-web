// Use the client directive for using usePathname hook.
'use client'

import AppNavbar from '@/components/AppNavbar';
import AppSideBar from '@/components/AppSideBar';
import { PropsWithChildren, useEffect, useState } from 'react';

export const DashboardLayout = ({ children }: PropsWithChildren) => {
    const [showSidebar, setShowSidebar] = useState(true);

    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleSidebarBasedOnWidth = () => {
        if (window.innerWidth >= 1024) {
            setShowSidebar(true);
        } else {
            setShowSidebar(false);
        }
    }

    useEffect(() => {
        toggleSidebarBasedOnWidth();

        const handleResize = () => {
            toggleSidebarBasedOnWidth();
        };
    
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <AppSideBar show={showSidebar} />
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <AppNavbar onToggleSidebar={toggleSidebar} />
                <main>
                    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
};