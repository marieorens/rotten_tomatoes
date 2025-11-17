'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Video, Home, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    title: 'Films',
    icon: Video,
    url: '/admin/films',
  },
  {
    title: 'Utilisateurs',
    icon: Users,
    url: '/admin/users',
  },
  {
    title: 'Accueil',
    icon: Home,
    url: '/',
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-4">
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">Admin Panel</span>
              <span className="text-xs text-sidebar-foreground/70">Gestion</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <div className="flex-1" />
        </div>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
