"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { useToast } from '@/hooks/use-toast';
import { auth } from '../../services/auth';
import Image from 'next/image';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Tableau de Bord',
  '/dashboard/clients': 'Gestion des Projets',
  '/dashboard/building-info': 'Gestion des Bâtiments',
  '/dashboard/electrical': 'Installation Électrique',
  '/dashboard/audit': 'Configuration de l\'Audit',
  '/dashboard/equipements': 'Équipements & Énergie',
  '/dashboard/inventory': 'Inventaire des Équipements', // Ancien lien pour compatibilité
  '/dashboard/energy': 'Calcul Énergétique', // Ancien lien pour compatibilité
  '/dashboard/reports': 'Rapports et Exports',
  '/dashboard/settings': 'Paramètres',
};

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const avatarImage = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    try {
      auth.logout();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

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
        <div className="relative ml-auto flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {avatarImage && (
                <Image
                  src={avatarImage.imageUrl}
                  alt={avatarImage.description}
                  data-ai-hint={avatarImage.imageHint}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user ? `${user.prenom} ${user.nom}` : 'Mon Compte'}
            </DropdownMenuLabel>
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
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
