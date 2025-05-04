'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth.schema';
import { login } from '@/lib/server-only/users/users.actions';
import { useState } from 'react';
import { Input } from '@/components/primitives/input';
import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/primitives/card';
import { Headphones, Link } from 'lucide-react';
import { Separator } from '@/components/primitives/separator';
import { Label } from '@/components/primitives/label';
import { Checkbox } from '@/components/primitives/checkbox';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      const result = await login(formData);
      if (!result || !result.success) {
        setError(result?.error || 'Error desconocido');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Headphones className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="ejemplo@correo.com" {...register('email')} />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link 
                  href="/recuperar-password" 
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm">Recordar sesión</Label>
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
            </Button>
            <div className="relative flex items-center justify-center">
              <Separator className="w-full" />
              <span className="absolute bg-card px-2 text-xs text-muted-foreground">
                O continúa con
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button">Google</Button>
              <Button variant="outline" type="button">Apple</Button>
            </div>
          </CardContent>
        </form>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" className="font-medium text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 