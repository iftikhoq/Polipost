'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Layers, History, User as UserIcon, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'হোম', icon: null },
    { href: '/create', label: 'পোস্টার তৈরি', icon: PlusCircle },
    { href: '/history', label: 'আমার পোস্টার', icon: History, protected: true },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary-soft to-accent flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            <span className="text-white font-extrabold text-xl tracking-tighter">P</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-text-primary">
                Poli<span className="text-accent">post</span>
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-primary-subtle text-primary font-bold">
                বাংলা AI
              </span>
            </div>
            <span className="text-[10px] text-text-subtle font-medium -mt-1 font-bangla">
              ডিজিটাল রাজনৈতিক পোস্টার মেকার
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary-subtle text-primary'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface-subtle'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action & User CTA */}
        <div className="flex items-center gap-3">
          <Link href="/create">
            <Button size="sm" variant="accent" className="hidden sm:inline-flex shadow-sm gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>নতুন পোস্টার</span>
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-text-primary leading-tight">{user.name}</span>
                <span className="text-[10px] text-text-subtle font-medium">কোটা: {user.posterQuota} টি</span>
              </div>
              <button
                onClick={logout}
                title="লগআউট"
                className="p-2 rounded-lg text-text-subtle hover:text-accent hover:bg-surface-subtle transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button size="sm" variant="ghost">
                  লগইন
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="outline">
                  রেজিস্টার
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
