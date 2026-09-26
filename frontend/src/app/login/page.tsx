'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/create';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success && res.data.token) {
        login(res.data.token, res.data.user);
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full p-8 shadow-xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3 shadow-md">
          P
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary font-bangla">অ্যাকাউন্টে লগইন করুন</h1>
        <p className="text-xs text-text-muted font-bangla mt-1">
          আপনার সংরক্ষিত পোস্টার দেখতে ও নতুন পোস্টার তৈরি করতে লগইন করুন।
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-status-danger-bg border border-status-danger/30 text-status-danger text-xs flex items-center gap-2 font-bangla">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="ইমেইল অ্যাড্রেস"
          type="email"
          required
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="পাসওয়ার্ড"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="accent"
          size="lg"
          isLoading={isLoading}
          className="w-full gap-2 font-bangla mt-2"
        >
          <span>লগইন করুন</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="border-t border-border mt-6 pt-4 text-center">
        <p className="text-xs text-text-muted font-bangla">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/register" className="text-primary font-bold hover:underline">
            নতুন অ্যাকাউন্ট খুলুন
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="p-8 text-center font-bangla">লোড হচ্ছে...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
