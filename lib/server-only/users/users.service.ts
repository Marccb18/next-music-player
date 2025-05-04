'use server';

import bcrypt from 'bcryptjs';

import { connectMongo } from '@/lib/mongo';
import { User } from '@/lib/mongo/models/Users';

export async function loginUser(email: string, password: string) {
  try {
    await connectMongo();

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    // Eliminamos la contraseña y campos sensibles del objeto antes de devolverlo
    const { password: _, _createdAt, _updatedAt, ...userWithoutPassword } = user.toJSON();
    return {
      ...userWithoutPassword,
      _id: user._id.toString()
    };
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

export async function registerUser(name: string, email: string, password: string) {
  try {
    await connectMongo();

    // Validación básica
    if (!email || !password || !name) {
      throw new Error('Todos los campos son requeridos');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('El email ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    // Eliminamos la contraseña y campos sensibles del objeto antes de devolverlo
    const { password: _, _createdAt, _updatedAt, ...userWithoutPassword } = user.toJSON();
    return {
      ...userWithoutPassword,
      _id: user._id.toString(),
    };
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
}
