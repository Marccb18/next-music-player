'use client';

import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/primitives/avatar';
import { Button } from '@/components/primitives/button';
import { SidebarFooter } from '@/components/primitives/sidebar';

import { useAuth } from '@/lib/hooks/useAuth';

export function AppSidebarFooter() {
  const { logout, user } = useAuth();
  console.log('User data:', user);
  console.log('Avatar URL:', user?.avatar);
  
  return (
    <SidebarFooter>
      <Avatar>
        <AvatarImage
          src={user?.avatar} 
          alt={user?.name || 'User avatar'}
          onError={(e) => {
            console.error('Error loading avatar:', e);
            // Force fallback if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <Button onClick={logout}>Cerrar sesión</Button>
    </SidebarFooter>
  );
}
