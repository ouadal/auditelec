'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Building,
  ClipboardList,
  FileDown,
  GaugeCircle,
  Home,
  LogOut,
  Package,
  Waves,
  Zap,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Card } from '@/components/ui/card';

const menuItems = [
  { href: '/dashboard/building-info', label: 'Bâtiment', icon: Building },
  { href: '/dashboard/electrical', label: 'Installation', icon: Zap },
  { href: '/dashboard/audit', label: 'Audit', icon: ClipboardList },
  { href: '/dashboard/inventory', label: 'Inventaire', icon: Package },
  { href: '/dashboard/energy', label: 'Énergie', icon: GaugeCircle },
  { href: '/dashboard/reports', label: 'Rapports', icon: FileDown },
  { href: '/dashboard', label: 'Tableau de Bord', icon: Home },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Waves className="h-7 w-7 text-primary" />
            <span className="duration-200 group-data-[collapsible=icon]:opacity-0">
              EnerAudit
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="space-y-2 p-2">
            {menuItems.map((item) => (
              <Card key={item.href} className="bg-sidebar-accent">
                <SidebarMenuItem>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      className="w-full"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </Card>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="p-2">
             <Card className="bg-sidebar-accent">
                <SidebarMenuItem>
                    <Link href="/login" legacyBehavior passHref>
                      <SidebarMenuButton tooltip="Se déconnecter" className="w-full">
                        <LogOut />
                        <span>Se déconnecter</span>
                      </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
              </Card>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
