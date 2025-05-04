'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth.schema';
import { register as registerAction } from '@/lib/server-only/users/users.actions';
import { useState } from 'react';
import { Input } from '@/components/primitives/input';
import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { useRouter } from 'next/navigation';

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      
      const result = await registerAction(formData);
      if (!result.success) {
        setError(result.error);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Ocurrió un error al registrarse');
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Crear cuenta</CardTitle>
        <CardDescription className="text-center">
          Únete para disfrutar de la mejor experiencia musical
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Input
              id="name"
              type="text"
              placeholder="Nombre"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Contraseña"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 