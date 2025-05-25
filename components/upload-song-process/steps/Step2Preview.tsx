import { Music, ChevronLeft, ChevronRight, Play } from "lucide-react"
import Image from "next/image"
import { Button } from "../../primitives/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../primitives/card"
import { Badge } from "../../primitives/badge"
import { Separator } from "../../primitives/separator"
import { SpotifyRelease } from "../types"

interface Step2PreviewProps {
  spotifyData: SpotifyRelease
  onBack: () => void
  onNext: () => void
}

export function Step2Preview({ spotifyData, onBack, onNext }: Step2PreviewProps) {
  return (
    <Card className="max-w-4xl mx-auto transform transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Previsualización del Lanzamiento
        </CardTitle>
        <CardDescription>Verifica que esta sea la información correcta del lanzamiento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Album Art */}
          <div className="space-y-4">
            <Image
              src={spotifyData.image || "/placeholder.svg"}
              alt={spotifyData.name}
              width={300}
              height={300}
              className="w-full rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
            />
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-xs">
                {spotifyData.albumType.toUpperCase()}
              </Badge>
              <p className="text-sm text-slate-600">{spotifyData.releaseDate}</p>
            </div>
          </div>

          {/* Album Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{spotifyData.name}</h3>
              <p className="text-lg text-slate-600">{spotifyData.artist}</p>
              <p className="text-sm text-slate-500 mt-1">{spotifyData.totalTracks} canciones</p>
            </div>

            <Separator />

            {/* Track List */}
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900">Lista de Canciones</h4>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {spotifyData.tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500 w-6">{track.trackNumber}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{track.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">{track.duration}</span>
                      <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button
            onClick={onNext}
            className="transition-all duration-200 hover:scale-105"
          >
            Continuar
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 