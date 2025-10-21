"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Building,
  ClipboardList,
  FileDown,
  GaugeCircle,
  Home,
  Package,
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Separator } from "@/components/ui/separator";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { NavigationLoading } from "@/components/ui/navigation-loading";

const menuItems = [
  { href: "/dashboard", label: "Tableau de Bord", icon: Home },
  { href: "/dashboard/clients", label: "Projets", icon: Users },
  { href: "/dashboard/building-info", label: "Bâtiments", icon: Building },
  { href: "/dashboard/electrical", label: "Installation", icon: Zap },
  { href: "/dashboard/audit", label: "Audit", icon: ClipboardList },
  { href: "/dashboard/equipements", label: "Équipements", icon: GaugeCircle },
  { href: "/dashboard/reports", label: "Rapports", icon: FileDown },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64 bg-card border-r border-gray-200/60">
          <div className="p-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Waves className="h-7 w-7 text-primary" />
              <span>EnerAudit</span>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="flex items-center justify-center min-h-screen">
            <LoadingPage text="Initialisation du tableau de bord..." />
          </div>
        </main>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div suppressHydrationWarning>
        <NavigationLoading />
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
                  <SidebarMenuItem
                    key={item.href}
                    data-active={pathname === item.href}
                    className="m-0 p-0 shadow-none"
                  >
                    <SidebarMenuButton
                      asChild
                      variant="ghost"
                      size="lg"
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      className="w-full justify-start rounded-md"
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 overflow-y-auto bg-gray-50/50">
            <DashboardHeader />
            <div className="p-4 md:p-6 lg:p-8">{children}</div>
          </main>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}
