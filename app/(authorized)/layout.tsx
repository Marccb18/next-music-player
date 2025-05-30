import Player from '@/components/player';
import { SidebarProvider } from '@/components/primitives/sidebar';
import { AppSidebar } from '@/components/sidebar/index';

export default function AuthorizedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="flex-1 w-full h-full">
        <Player />
        {children}
      </main>
    </SidebarProvider>
  );
}
