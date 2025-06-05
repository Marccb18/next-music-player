import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { FeaturedPlaylists } from '@/components/views/home/featured-playlists';
import { RecentReleases } from '@/components/views/home/recent-releases';
import { RecentlyPlayed } from '@/components/views/home/recently-played';
import { RecommendedForYou } from '@/components/views/home/recommended-for-you';
import { HomePage as HomePageView } from '@/components/views/home/home-page';

import { connectMongo } from '@/lib/mongo';
import { User } from '@/lib/mongo/models/Users';
import { getHomePageData } from '@/lib/server-only/home/home.service';

export default async function HomePage() {
  const userCookie = cookies().get('user_id');

  if (!userCookie) {
    redirect('/login');
  }

  await connectMongo();
  const user = await User.findById(userCookie.value).select('-password');

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex-1 pb-8">
      <HomePageView />
    </div>
  );
}
