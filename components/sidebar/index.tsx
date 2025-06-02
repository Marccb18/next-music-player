'use client';

import { Heart, Home, Library, Mic2, Music, Plus, Search, Upload } from 'lucide-react';

import { useEffect } from 'react';

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

import { usePlaylistsStore } from '@/lib/client-only/stores/playlistsStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { getPlaylists as getPlaylistsFromServer } from '@/lib/server-only/playlists/playlists.service';

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
    url: '/library',
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

export function AppSidebar() {
  const { user } = useAuth();
  const { setPlaylists } = usePlaylistsStore();
  const playlists = usePlaylistsStore((state) => state.playlists);

  useEffect(() => {
    if (user?._id) {
      getPlaylistsFromServer(user._id).then((playlists) => {
        setPlaylists(playlists);
      });
    }
  }, [user?._id, setPlaylists]);

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
                <SidebarMenuItem key={playlist.id}>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Music />
                      <span>{playlist.name}</span>
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
