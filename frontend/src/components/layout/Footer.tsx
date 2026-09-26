import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">
                P
              </div>
              <span className="text-lg font-extrabold text-text-primary">
                Poli<span className="text-accent">post</span>
              </span>
            </div>
            <p className="text-xs text-text-muted max-w-sm font-bangla leading-relaxed">
              বাংলাদেশের রাজনৈতিক ও সামাজিক নেতৃবৃন্দের জন্য প্রথম স্বয়ংক্রিয় এআই পোস্টার মেকার।
              সঠিক বাংলা টাইপোগ্রাফি, জাতীয় ও দলীয় ঐতিহ্যের মেলবন্ধনে প্রিন্ট-রেডি পোস্টার কয়েক মিনিটে।
            </p>
          </div>

          {/* Quick Occasions */}
          <div>
            <h4 className="text-xs font-bold text-text-primary tracking-wider uppercase mb-3">
              উপলক্ষসমূহ
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link href="/create?occasion=victory_day" className="hover:text-primary transition-colors">
                  মহান বিজয় দিবস
                </Link>
              </li>
              <li>
                <Link href="/create?occasion=mourning" className="hover:text-primary transition-colors">
                  শোক ও স্মরণ সভা
                </Link>
              </li>
              <li>
                <Link href="/create?occasion=campaign" className="hover:text-primary transition-colors">
                  নির্বাচনী প্রচার ও মিছিল
                </Link>
              </li>
              <li>
                <Link href="/create?occasion=eid" className="hover:text-primary transition-colors">
                  পবিত্র ঈদ ও পূজা শুভেচ্ছা
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Standards */}
          <div>
            <h4 className="text-xs font-bold text-text-primary tracking-wider uppercase mb-3">
              তথ্য ও নীতিমালা
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>নিরাপত্তা ও কনটেন্ট মডারেশন</li>
              <li>প্রিন্ট গাইডলাইন (৩০০ ডিপিআই)</li>
              <li>কপিরাইট ও স্বত্বাধিকার</li>
              <li className="pt-2 text-primary font-bold">সংস্করণ v1.0.0 (MVP)</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-text-subtle gap-2">
          <p>© {new Date().getFullYear()} Polipost. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="font-bangla">তৈরি হয়েছে দেশীয় ঐতিহ্যে এবং আধুনিক এআই প্রযুক্তিতে 🇧🇩</p>
        </div>
      </div>
    </footer>
  );
};
