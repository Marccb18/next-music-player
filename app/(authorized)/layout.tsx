import { AudioPlayer } from '@/components/player';
import { SidebarProvider } from '@/components/primitives/sidebar';
import { AppSidebar } from '@/components/sidebar/index';

export default function AuthorizedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="flex-1 w-full h-full">
        <AudioPlayer src="https://next-music-player.s3.eu-west-3.amazonaws.com/tracks/7yvmtCjHcBe9DqIVl7AwQT/CRUZ+CAFUN%C3%89+-+BABI+BOI+ft.+CHITA+(Visualizer)+%5Bc-szfuDO0_E%5D.mp3" />
        {children}
      </main>
    </SidebarProvider>
  );
}
