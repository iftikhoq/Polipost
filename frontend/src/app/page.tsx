import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Printer, Wand2, Image, Layers, Flag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function HomePage() {
  const sampleTemplates = [
    {
      title: 'মহান বিজয় দিবস - জাতীয় স্মৃতিসৌধ থিম',
      tag: 'বিজয় দিবস',
      img: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop',
      occasion: 'victory_day',
      accent: 'border-primary',
    },
    {
      title: 'গভীর শোক ও বিনম্র শ্রদ্ধাঞ্জলি',
      tag: 'শোক দিবস',
      img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
      occasion: 'mourning',
      accent: 'border-slate-700',
    },
    {
      title: 'আমেরিকান পপ-আর্ট "হোপ" শৈলী (Shepard Fairey Style)',
      tag: 'পপ-আর্ট / গ্লোবাল',
      img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop',
      occasion: 'international',
      accent: 'border-blue-700',
    },
    {
      title: 'কনস্ট্রাক্টিভিস্ট অ্যাজিটপ্রপ শৈলী (Soviet Avant-Garde)',
      tag: 'অ্যাজিটপ্রপ / গ্লোবাল',
      img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop',
      occasion: 'international',
      accent: 'border-red-700',
    },
    {
      title: 'সুইস মিনিম্যালিস্ট গ্রিড শৈলী (Zurich Modernism)',
      tag: 'সুইস গ্রিড / গ্লোবাল',
      img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop',
      occasion: 'international',
      accent: 'border-sky-600',
    },
  ];

  const features = [
    {
      icon: Wand2,
      title: '১০০% সঠিক বাংলা টাইপোগ্রাফি',
      desc: 'কোনো ভাঙা যুক্তবর্ণ বা বিকৃত হরফ নয়। স্ট্যান্ডার্ড ইউনিকোড ওপেনটাইপ ফন্টে ঝকঝকে বাংলা শিরোনাম ও পদবি।',
    },
    {
      icon: Sparkles,
      title: 'Google Gemini এআই স্লোগান সহায়ক',
      desc: 'উপলক্ষ ও দলীয় প্রেক্ষাপট অনুযায়ী প্রাসঙ্গিক, বলিষ্ঠ ও প্রমিত রাজনৈতিক স্লোগান সরাসরি সাজেস্ট করে।',
    },
    {
      icon: Layers,
      title: 'শীর্ষ নেতা ও প্রার্থীর ছবি ফ্রেম',
      desc: 'উপরে ১–৩ জন শীর্ষ নেতার প্রতিকৃতি এবং নিচে আপনার ছবি স্বয়ংক্রিয়ভাবে গোল্ডেন ব্যাজ ফ্রেমে বিন্যস্ত হবে।',
    },
    {
      icon: Printer,
      title: '৩০০ DPI প্রিন্ট-রেডি এক্সপোর্ট',
      desc: '২৪০০×৩২০০০ পিক্সেল আল্ট্রা-এইচডি কোয়ালিটিতে ডাবল ডেমি কাগজের সাইজে সরাসরি প্রেস থেকে প্রিন্ট করার উপযোগী।',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 bg-gradient-to-b from-primary-subtle/50 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-bangla mb-6">
            <Flag className="w-3.5 h-3.5 text-accent" />
            <span>বাংলাদেশের প্রথম ডিজিটাল রাজনৈতিক পোস্টার মেকার</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-text-primary tracking-tight font-bangla leading-[1.15] max-w-4xl mx-auto">
            যেকোনো রাজনৈতিক পোস্টার তৈরি করুন{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-600 to-accent">
              মাত্র ২ মিনিটে
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-text-muted font-bangla max-w-2xl mx-auto leading-relaxed">
            বিজয় দিবস, শোক সভা, নির্বাচনী প্রচারণা বা ঈদ শুভেচ্ছা—আপনার নাম, পদবি ও ছবি দিয়ে এআই
            প্রযুক্তিতে তৈরি করুন প্রেস-রেডি রাজনৈতিক পোস্টার। কোনো গ্রাফিক্স ডিজাইনারের প্রয়োজন নেই!
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/create">
              <Button size="lg" variant="accent" className="w-full sm:w-auto gap-2 font-bangla shadow-lg shadow-accent/20">
                <Sparkles className="w-5 h-5" />
                <span>বিনামূল্যে পোস্টার তৈরি করুন</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/create?occasion=victory_day">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 font-bangla">
                <span>বিজয় দিবসের টেমপ্লেট দেখুন</span>
              </Button>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-text-muted font-bangla">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-status-success" />
              <span>নিখুঁত বাংলা ফন্ট (হিন্দ শিলিগুড়ি)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-status-success" />
              <span>৩ শীর্ষ নেতার ছবি স্লট</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-status-success" />
              <span>২৪০০×৩২০০০ প্রিন্ট রেজোলিউশন</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Templates Showcase */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-primary tracking-wider uppercase font-bangla">
                রেডিমেড ডিজাইন
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-bangla mt-1">
                জনপ্রিয় পোস্টার ক্যাটাগরি
              </h2>
            </div>
            <Link href="/create">
              <Button variant="ghost" size="sm" className="font-bangla gap-1 text-primary">
                <span>সবগুলো ডিজাইন দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleTemplates.map((template, idx) => (
              <Card key={idx} hoverable className="p-4 flex flex-col justify-between overflow-hidden group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 mb-4 border border-border">
                  <img
                    src={template.img}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="primary">{template.tag}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-base text-text-primary font-bangla">{template.title}</h3>
                  <p className="text-xs text-text-muted font-bangla">
                    ঐতিহাসিক স্মৃতিসৌধ ও দলীয় পতাকার আবহসংবলিত প্রমিত পোস্টার।
                  </p>
                  <Link href={`/create?occasion=${template.occasion}`}>
                    <Button variant="outline" size="sm" className="w-full mt-3 font-bangla gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      এই ডিজাইনে তৈরি করুন
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-primary tracking-wider uppercase font-bangla">
            সহজ ৩ ধাপ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-bangla mt-1 mb-12">
            কিভাবে Polipost কাজ করে?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary font-black text-xl flex items-center justify-center mx-auto">
                ১
              </div>
              <h3 className="text-base font-bold text-text-primary font-bangla">উপলক্ষ ও ডিজাইন বাছুন</h3>
              <p className="text-xs text-text-muted font-bangla leading-relaxed">
                বিজয় দিবস, শোক সভা বা নির্বাচনী ক্যাম্পেইন থেকে আপনার পছন্দের টেমপ্লেট নির্বাচন করুন।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary font-black text-xl flex items-center justify-center mx-auto">
                ২
              </div>
              <h3 className="text-base font-bold text-text-primary font-bangla">তথ্য লিখুন ও ছবি দিন</h3>
              <p className="text-xs text-text-muted font-bangla leading-relaxed">
                আপনার নাম, পদবি এবং নেতাদের ছবি আপলোড করুন। Gemini এআই স্বয়ংক্রিয় স্লোগান তৈরি করে দিবে।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary font-black text-xl flex items-center justify-center mx-auto">
                ৩
              </div>
              <h3 className="text-base font-bold text-text-primary font-bangla">ডাউনলোড ও প্রিন্ট করুন</h3>
              <p className="text-xs text-text-muted font-bangla leading-relaxed">
                লাইভ প্রিভিউ দেখে এক ক্লিকে ৩০০ ডিপিআই প্রিন্ট-রেডি আল্ট্রা-এইচডি ফরম্যাটে ডাউনলোড করুন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-16 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-bangla">
              কেন Polipost রাজনৈতিক কর্মীদের প্রথম পছন্দ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-5 rounded-xl border border-border bg-background space-y-2.5">
                  <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-text-primary font-bangla">{feat.title}</h3>
                  <p className="text-xs text-text-muted font-bangla leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-emerald-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-black font-bangla mb-4">
            আজই আপনার রাজনৈতিক প্রচার শুরু করুন
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 font-bangla max-w-xl mx-auto mb-8">
            কোনো জটিলতা ছাড়াই মাত্র ২ মিনিটে তৈরি করুন আকর্ষণীয় ও মর্যাদাপূর্ণ রাজনৈতিক পোস্টার।
          </p>
          <Link href="/create">
            <Button size="lg" variant="accent" className="font-bangla gap-2 shadow-2xl">
              <Sparkles className="w-5 h-5" />
              <span>এখনই পোস্টার তৈরি করুন</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
