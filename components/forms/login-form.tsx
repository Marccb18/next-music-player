'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Headphones } from 'lucide-react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/primitives/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/primitives/card';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';

import { useUserStore } from '@/lib/client-only/stores/userStore';
import { login } from '@/lib/server-only/users/users.actions';
import { type LoginFormData, loginSchema } from '@/lib/validations/auth.schema';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser, setLoading, setError: setStoreError } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);
    setStoreError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      const result = await login(formData);

      if (!result.success) {
        setError(result.error || 'Error desconocido');
        setStoreError(result.error || 'Error desconocido');
        return;
      }

      setUser(result.user);
      router.refresh();
      router.push('/');
    } catch (err) {
      const errorMessage = 'Ocurrió un error al iniciar sesión';
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Headphones className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            {error && <div className="text-sm text-red-500 text-center">{error}</div>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
