'use client';

import { LoginForm } from '@/components/forms/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <LoginForm />
      </div>
    </div>
  );
} 