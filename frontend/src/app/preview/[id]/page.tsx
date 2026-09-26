'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Download, Printer, RefreshCw, ArrowLeft, Share2, Sparkles, Check, Edit3 } from 'lucide-react';
import { api } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';

export default function PosterPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const posterId = params.id as string;

  const [poster, setPoster] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    headline: '',
    slogan: '',
    requesterName: '',
    designation: '',
  });

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/posters/${posterId}`);
        if (res.data?.success && res.data.poster) {
          setPoster(res.data.poster);
          setEditFormData({
            headline: res.data.poster.formData.headline,
            slogan: res.data.poster.formData.slogan,
            requesterName: res.data.poster.formData.requesterName,
            designation: res.data.poster.formData.designation,
          });
        }
      } catch (err) {
        console.error('Failed to load poster:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (posterId) fetchPoster();
  }, [posterId]);

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      const res = await api.post(`/posters/${posterId}/regenerate`, {
        formData: editFormData,
      });
      if (res.data?.success && res.data.poster) {
        setPoster(res.data.poster);
        setShowEditModal(false);
      }
    } catch (err) {
      console.error('Regeneration error:', err);
      alert('পুনরায় তৈরি করতে সমস্যা হয়েছে।');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownload = () => {
    if (!poster?.generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = poster.generatedImageUrl;
    a.download = `Polipost_${poster.formData.headline.substring(0, 15)}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-text-primary font-bangla">পোস্টার লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!poster) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h2 className="text-lg font-bold text-text-primary font-bangla mb-2">পোস্টার খুঁজে পাওয়া যায়নি</h2>
        <Link href="/create">
          <Button variant="primary">নতুন পোস্টার তৈরি করুন</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-subtle hover:text-text-primary transition-colors mb-2 font-bangla"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            নতুন পোস্টার তৈরি করুন
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-text-primary font-bangla truncate">
              {poster.formData.headline}
            </h1>
            <Badge variant="success">প্রিন্ট রেডি</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)} className="gap-1.5 font-bangla">
            <Edit3 className="w-4 h-4" />
            <span>লেখা পরিবর্তন ও রি-জেনারেট</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 font-bangla">
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </Button>
          <Button variant="accent" size="sm" onClick={handleDownload} className="gap-1.5 font-bangla shadow-md">
            <Download className="w-4 h-4" />
            <span>হাই-রেজ ডাউনলোড (PNG)</span>
          </Button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex justify-center">
          <div className="w-full max-w-[560px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-border bg-slate-950 relative group">
            {poster.generatedImageUrl ? (
              <img
                src={poster.generatedImageUrl}
                alt={poster.formData.headline}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
                <Sparkles className="w-12 h-12 text-gold animate-pulse mb-3" />
                <p className="font-bold text-lg font-bangla">হাই-রেজোলিউশন প্রসেসিং চলছে...</p>
                <p className="text-xs text-slate-400 mt-1 font-bangla">
                  কিছুক্ষণের মধ্যে পোস্টারটি প্রদর্শিত হবে।
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Details & Specs */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-text-primary font-bangla">পোস্টারের বিবরণ</h3>

            <div className="space-y-2 text-xs border-b border-border pb-4">
              <div className="flex justify-between">
                <span className="text-text-subtle font-bangla">প্রার্থীর নাম:</span>
                <span className="font-bold text-text-primary font-bangla">{poster.formData.requesterName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-subtle font-bangla">পদবি:</span>
                <span className="font-semibold text-text-primary font-bangla">{poster.formData.designation || '–'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-subtle font-bangla">দল/সংগঠন:</span>
                <span className="font-semibold text-primary font-bangla">{poster.formData.party || '–'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-subtle font-bangla">এলাকা:</span>
                <span className="text-text-primary font-bangla">{poster.formData.unionThanaDistrict || '–'}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-text-subtle font-bangla block">প্রিন্ট স্পেসিফিকেশন:</span>
              <div className="p-3 rounded-lg bg-surface-subtle space-y-1">
                <p className="font-semibold text-text-primary">রেজোলিউশন: ২৪০০×৩২০০০ (300 DPI)</p>
                <p className="text-text-muted">অনুপাত: ৩:৪ (স্ট্যান্ডার্ড বাংলাদেশি পোস্টার ডাবল ডেমি)</p>
                <p className="text-text-muted">ফন্ট: হিন্দ শিলিগুড়ি ও অনেক বাংলা (Unicode)</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
              প্রচার ও শেয়ার
            </h4>
            <p className="text-xs text-text-muted font-bangla mb-4">
              ফেসবুক বা হোয়াটসঅ্যাপে নেতাকর্মীদের সাথে সরাসরি শেয়ার করুন।
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('লিংক কপি করা হয়েছে!');
                }}
              >
                <Share2 className="w-3.5 h-3.5 mr-1" />
                লিংক কপি
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit & Regenerate Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-text-primary font-bangla">
                পোস্টারের লেখা পরিবর্তন ও রি-জেনারেট
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-text-subtle hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <Input
                label="মূল শিরোনাম"
                value={editFormData.headline}
                onChange={(e) => setEditFormData({ ...editFormData, headline: e.target.value })}
                className="font-bangla"
              />
              <Input
                label="স্লোগান বা বাণী"
                value={editFormData.slogan}
                onChange={(e) => setEditFormData({ ...editFormData, slogan: e.target.value })}
                className="font-bangla"
              />
              <Input
                label="আপনার নাম"
                value={editFormData.requesterName}
                onChange={(e) => setEditFormData({ ...editFormData, requesterName: e.target.value })}
                className="font-bangla"
              />
              <Input
                label="পদবি"
                value={editFormData.designation}
                onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                className="font-bangla"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                বাতিল
              </Button>
              <Button
                variant="accent"
                size="sm"
                isLoading={isRegenerating}
                onClick={handleRegenerate}
                className="gap-1.5 font-bangla"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                আপডেট ও রি-জেনারেট
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
