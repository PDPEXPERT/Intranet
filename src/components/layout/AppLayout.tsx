'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SidebarProvider, useSidebar } from './SidebarContext';

function AppLayoutInner({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div
        className={`flex flex-col min-h-screen transition-[margin] duration-200 ${
          collapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <TopBar />
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </SidebarProvider>
  );
}
