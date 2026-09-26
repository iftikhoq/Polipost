'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (res.data?.success && res.data.token) {
        login(res.data.token, res.data.user);
        router.push('/create');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'নিবন্ধন সম্পন্ন করা যায়নি');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3 shadow-md">
            P
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary font-bangla">নতুন অ্যাকাউন্ট খুলুন</h1>
          <p className="text-xs text-text-muted font-bangla mt-1">
             Polipost এ যোগ দিয়ে রাজনৈতিক পোস্টার জেনারেট করুন বিনামূল্যে।
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-status-danger-bg border border-status-danger/30 text-status-danger text-xs flex items-center gap-2 font-bangla">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="আপনার পূর্ণ নাম"
            required
            placeholder="উদা: মোঃ নাজমুল হক"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-bangla"
          />

          <Input
            label="ইমেইল অ্যাড্রেস"
            type="email"
            required
            placeholder="nazmul@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="মোবাইল নম্বর (ঐচ্ছিক)"
            type="tel"
            placeholder="017XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
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
            className="w-full gap-2 font-bangla mt-3"
          >
            <span>নিবন্ধন সম্পন্ন করুন</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="border-t border-border mt-6 pt-4 text-center">
          <p className="text-xs text-text-muted font-bangla">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              লগইন করুন
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
