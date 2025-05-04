'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { loginUser, registerUser } from './users.service';

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = await loginUser(email, password);

    if (!user || !user._id) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Aquí podrías generar un token JWT o usar sesiones
    // Por simplicidad, guardaremos el ID del usuario en una cookie
    cookies().set('user_id', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function register(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = await registerUser(name, email, password);

    cookies().set('user_id', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function logout() {
  cookies().delete('user_id');
  redirect('/login');
}
