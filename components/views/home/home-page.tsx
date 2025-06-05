"use client"
import { RecentReleases } from "@/components/views/home/recent-releases"
import { RecentArtists } from "@/components/views/home/recent-artists"
import { RecentlyPlayed } from "@/components/views/home/recently-played"
import { FeaturedPlaylists } from "@/components/views/home/featured-playlists"
import { RecommendedForYou } from "@/components/views/home/recommended-for-you"
import { HeroSection } from "@/components/views/home/hero-section"
import { useHomeData } from "@/lib/client-only/hooks/use-home-data"

export function HomePage() {
  const { isLoading, data } = useHomeData() 

  return (
    <div className="flex-1 py-8">
      <HeroSection isLoading={isLoading} featured={data.featured} />

      <div className="px-6 space-y-10">
        <RecentReleases isLoading={isLoading} releases={data.recentReleases} />

        <RecentArtists isLoading={isLoading} artists={data.recentArtists} />

        <RecentlyPlayed isLoading={isLoading} tracks={data.recentlyPlayed} />

        <FeaturedPlaylists isLoading={isLoading} playlists={data.featuredPlaylists} />

        <RecommendedForYou isLoading={isLoading} albums={data.recommendedAlbums} />
      </div>
    </div>
  )
}
