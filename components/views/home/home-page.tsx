'use client';

import { useHomeData } from '@/hooks/useHomeData';

import { FeaturedPlaylists } from '@/components/views/home/featured-playlists';
import { HeroSection } from '@/components/views/home/hero-section';
import { RecentReleases } from '@/components/views/home/recent-releases';
import { RecentlyPlayed } from '@/components/views/home/recently-played';
import { RecommendedForYou } from '@/components/views/home/recommended-for-you';

export function HomePage() {
  const { isLoading, data } = useHomeData();

  return (
    <div className="flex-1 pb-8">
      <HeroSection isLoading={isLoading} featured={data.featured} />

      <div className="px-6 space-y-10">
        <RecentReleases isLoading={isLoading} releases={data.recentReleases} />

        {/* <RecentArtists isLoading={isLoading} artists={data.recentArtists} /> */}

        <RecentlyPlayed isLoading={isLoading} tracks={data.recentlyPlayed} />

        <FeaturedPlaylists isLoading={isLoading} playlists={data.featuredPlaylists} />

        <RecommendedForYou isLoading={isLoading} albums={data.recommendedAlbums} />
      </div>
    </div>
  );
}
