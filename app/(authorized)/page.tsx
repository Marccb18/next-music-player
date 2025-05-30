import { MediaPlayer, MediaProvider } from '@vidstack/react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Player from '@/components/player';

import { connectMongo } from '@/lib/mongo';
import { User } from '@/lib/mongo/models/Users';

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

  return <div className="bg-white shadow rounded-lg p-6"></div>;
}
