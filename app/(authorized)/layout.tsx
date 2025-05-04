import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/primitives/sidebar";
import { Home, Library, Settings } from "lucide-react";
import { AppSidebar } from '@/components/sidebar/index';

export default function AuthorizedLayout({ children }: { children: React.ReactNode }) {
  const userCookie = cookies().get('user_id');

  if (!userCookie) {
    redirect('/login');
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main>
        {children}
      </main>
    </SidebarProvider>
  );
}
