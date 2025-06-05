"use client"
import { Play, Calendar } from "lucide-react"
import { Button } from "@/components/primitives/button"
import { Skeleton } from "@/components/primitives/skeleton"
import { Badge } from "@/components/primitives/badge"
import { useFormat } from "@/hooks/use-format"
import type { Album } from "@/lib/types/music"

interface HeroSectionProps {
  isLoading: boolean
  featured: Album | null
}

export function HeroSection({ isLoading, featured }: HeroSectionProps) {
  const { formatDate } = useFormat()

  if (isLoading) {
    return (
      <div className="relative h-[400px] mb-10">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex items-end gap-6 max-w-7xl mx-auto">
            <Skeleton className="w-48 h-48 rounded-lg shrink-0" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-3 pt-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!featured) {
    return null
  }

  return (
    <div className="relative h-[400px] mb-10">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={featured.cover || "/placeholder.svg?height=800&width=1600"}
          alt={featured.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Gradiente para mejorar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

      {/* Contenido */}
      <div className="absolute bottom-0 left-0 p-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end gap-6 max-w-7xl mx-auto">
          <img
            src={featured.cover || "/placeholder.svg?height=200&width=200"}
            alt={featured.name}
            className="w-48 h-48 rounded-lg shadow-xl object-cover"
          />

          <div className="flex-1">
            <Badge className="mb-2">Destacado</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{featured.name}</h1>
            <div className="flex items-center gap-2 text-white/80 mb-4">
              <span className="font-medium">{featured.artists[0].name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(featured.releaseDate)}
              </span>
            </div>

            <div className="flex gap-3 mt-4">
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5 ml-0.5" />
                Reproducir
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Ver álbum
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
