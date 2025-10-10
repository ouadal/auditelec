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
} from '@/components/ui/sidebar';
import {
  Building,
  ClipboardList,
  FileDown,
  GaugeCircle,
  Home,
  Package,
  Waves,
  Zap,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Separator } from '@/components/ui/separator';

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
      <Sidebar className="border-r border-gray-200/60 bg-card">
        <SidebarHeader className="p-4">
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
        <Separator />
        <SidebarContent className="pt-8">
          <SidebarMenu className="p-2 space-y-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href} data-active={pathname === item.href} className="m-0 p-0 shadow-none">
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    variant="ghost"
                    size="lg"
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="w-full justify-start rounded-md"
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <DashboardHeader />
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
      </main>
    </SidebarProvider>
  );
}
