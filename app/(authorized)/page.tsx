import { cookies } from 'next/headers';

import { connectMongo } from '@/lib/mongo';
import { User } from '@/lib/mongo/models/Users';

export default async function HomePage() {
  const userCookie = cookies().get('user_id');

  if (!userCookie) {
    return null;
  }

  await connectMongo();
  const user = await User.findById(userCookie.value).select('-password');

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Bienvenido, {user?.name}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-900 mb-2">Tu Perfil</h3>
          <p className="text-indigo-700">Email: {user?.email}</p>
          <p className="text-indigo-700">Rol: {user?.role}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-green-900 mb-2">Estadísticas</h3>
          <p className="text-green-700">Próximamente...</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-purple-900 mb-2">Actividad Reciente</h3>
          <p className="text-purple-700">Próximamente...</p>
        </div>
      </div>
    </div>
  );
}
