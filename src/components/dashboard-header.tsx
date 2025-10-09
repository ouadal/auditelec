"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  LogOut,
  Search,
  Settings,
  User,
  Waves,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Tableau de Bord',
  '/dashboard/building-info': 'Informations Générales',
  '/dashboard/electrical': 'Installation Électrique',
  '/dashboard/audit': 'Configuration de l\'Audit',
  '/dashboard/inventory': 'Inventaire des Équipements',
  '/dashboard/energy': 'Calcul Énergétique',
  '/dashboard/reports': 'Rapports et Exports',
  '/dashboard/settings': 'Paramètres',
};

export function DashboardHeader() {
  const pathname = usePathname();
  const avatar = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/dashboard" className="hidden items-center gap-2 font-semibold md:flex">
          <Waves className="h-6 w-6 text-primary" />
          <span className="text-lg">EnerAudit</span>
        </Link>
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <h1 className="text-lg font-semibold">{pageTitles[pathname] ?? 'Dashboard'}</h1>
        </div>
        <div className="relative ml-auto flex-shrink-0">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {avatar && (
                  <Image
                    src={avatar.imageUrl}
                    width={32}
                    height={32}
                    alt={avatar.description}
                    data-ai-hint={avatar.imageHint}
                    className="rounded-full"
                  />
              )}
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
