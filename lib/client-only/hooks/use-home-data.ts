"use client"

import { useEffect, useState } from "react"
import { getHomePageData } from "@/lib/server-only/home/home.service"
import type { Album, Artist, Track } from "@/lib/types/music"
import type { Playlist } from "@/lib/types/playlist"
import { useRecentlyPlayedStore } from "@/lib/client-only/stores/recently-played-store"

interface HomeData {
  featured: Album | null
  recentReleases: Album[]
  recentArtists: Artist[]
  recentlyPlayed: Track[]
  featuredPlaylists: Playlist[]
  recommendedAlbums: Album[]
}

export function useHomeData() {
  const [isLoading, setIsLoading] = useState(true)
  const recentlyPlayedTracks = useRecentlyPlayedStore((state) => state.tracks)
  const [data, setData] = useState<HomeData>({
    featured: null,
    recentReleases: [],
    recentArtists: [],
    recentlyPlayed: [],
    featuredPlaylists: [],
    recommendedAlbums: []
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { recentTracks, recentPlaylists, popularAlbums } = await getHomePageData()
        
        setData({
          featured: popularAlbums[0] || null,
          recentReleases: popularAlbums,
          recentArtists: [], // TODO: Implementar
          recentlyPlayed: recentlyPlayedTracks,
          featuredPlaylists: recentPlaylists,
          recommendedAlbums: popularAlbums
        })
      } catch (error) {
        console.error("Error fetching home data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [recentlyPlayedTracks])

  return { isLoading, data }
} 