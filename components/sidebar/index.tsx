'use client';

import { Heart, Home, Library, Mic2, Music, Plus, Search, Upload } from 'lucide-react';

import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/primitives/sidebar';

import { useAuth } from '@/lib/hooks/useAuth';

import { AppSidebarFooter } from './footer';

const navigationItems = [
  {
    title: 'Inicio',
    url: '/',
    icon: Home,
  },
  {
    title: 'Buscar',
    url: '#',
    icon: Search,
  },
  {
    title: 'Tu Biblioteca',
    url: '#',
    icon: Library,
  },
];

const libraryItems = [
  {
    title: 'Canciones que te gustan',
    url: '#',
    icon: Heart,
  },
  {
    title: 'Artistas',
    url: '#',
    icon: Mic2,
  },
  {
    title: 'Álbumes',
    url: '#',
    icon: Music,
  },
];

const playlists = [
  'Mi Playlist #1',
  'Favoritos 2024',
  'Música para trabajar',
  'Chill Vibes',
  'Workout Mix',
];

export function AppSidebar() {
  const { user } = useAuth();
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Music className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Next Music Player</span>
                  <span className="truncate text-xs">Tu música favorita</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user?.role === 'admin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/upload">
                      <Upload />
                      <span>Upload</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tu Biblioteca</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            Playlists
            <Plus className="ml-auto h-4 w-4" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {playlists.map((playlist) => (
                <SidebarMenuItem key={playlist}>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Music />
                      <span>{playlist}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
      <AppSidebarFooter />
    </Sidebar>
  );
}
