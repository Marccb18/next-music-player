'use client';

import { RegisterForm } from '@/components/forms/register-form';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <RegisterForm />
      </div>
    </div>
  );
} 