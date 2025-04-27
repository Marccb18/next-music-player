import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <span className="font-bold">Music Player</span>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <h1 className="text-2xl font-bold">Bienvenido a Music Player</h1>
        <p className="mt-2 text-muted-foreground">Esta es una prueba de la página</p>
      </main>
    </div>
  );
} 