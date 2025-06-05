"use client"
import { ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/primitives/button"
import { ScrollArea, ScrollBar } from "@/components/primitives/scroll-area"
import { Skeleton } from "@/components/primitives/skeleton"
import { Artist } from "@/lib/types/music"

interface RecentArtistsProps {
  isLoading: boolean
  artists: Artist[]
}

export function RecentArtists({ isLoading, artists }: RecentArtistsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Artistas recientes</h2>
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <a href="/artists">
            Ver todo
            <ChevronRight className="h-4 w-4" />
          </a>
        </Button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[120px] shrink-0 space-y-3 text-center">
                  <div className="mx-auto">
                    <Skeleton className="h-24 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                  <Skeleton className="h-3 w-1/2 mx-auto" />
                </div>
              ))
            : artists.map((artist) => (
                <div key={artist.id} className="w-[120px] shrink-0 space-y-3 text-center group">
                  <div className="relative mx-auto">
                    <div className="h-24 w-24 rounded-full overflow-hidden">
                      <img
                        src={artist.images[0]?.url || "/placeholder.svg?height=96&width=96"}
                        alt={artist.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Button size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play className="h-5 w-5 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium truncate">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {artist.genres?.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}
