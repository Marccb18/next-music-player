'use client';

import { LoginForm } from '@/components/forms/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen min-w-screen w-full h-full flex-1 flex items-center justify-center bg-background">
      <LoginForm />
    </div>
  );
}
