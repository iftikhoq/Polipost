'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { History, Download, Trash2, ExternalLink, PlusCircle, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export default function PosterHistoryPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [posters, setPosters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/history');
      return;
    }

    const fetchPosters = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/posters/user/history');
        if (res.data?.success && res.data.posters) {
          setPosters(res.data.posters);
        }
      } catch (err) {
        console.error('Failed to fetch user poster history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPosters();
    }
  }, [user, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি এই পোস্টারটি মুছে ফেলতে নিশ্চিত?')) return;
    try {
      await api.delete(`/posters/${id}`);
      setPosters(posters.filter((p) => p._id !== id));
    } catch (err) {
      alert('পোস্টার মুছতে সমস্যা হয়েছে।');
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-text-primary font-bangla">হিস্টোরি লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary font-bangla flex items-center gap-2.5">
            <History className="w-6 h-6 text-primary" />
            <span>আমার সংরক্ষিত পোস্টারসমূহ</span>
          </h1>
          <p className="text-sm text-text-muted font-bangla mt-1">
            আপনার অ্যাকাউন্টে তৈরি ও সংরক্ষিত সকল পোস্টার এখান থেকে ডাউনলোড বা এডিট করুন।
          </p>
        </div>

        <Link href="/create">
          <Button variant="accent" size="sm" className="gap-2 font-bangla shadow-sm">
            <PlusCircle className="w-4 h-4" />
            নতুন পোস্টার তৈরি
          </Button>
        </Link>
      </div>

      {posters.length === 0 ? (
        <Card className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary-subtle text-primary flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary font-bangla">এখনো কোনো পোস্টার তৈরি করেননি</h3>
            <p className="text-xs text-text-muted font-bangla mt-1">
              মাত্র ২ মিনিটে আপনার প্রথম রাজনৈতিক পোস্টার তৈরি করুন।
            </p>
          </div>
          <Link href="/create">
            <Button variant="primary" size="sm" className="font-bangla">
              পোস্টার তৈরি শুরু করুন
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posters.map((poster) => (
            <Card key={poster._id} className="p-4 flex flex-col justify-between group overflow-hidden">
              <div>
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-900 border border-border mb-3">
                  {poster.generatedImageUrl ? (
                    <img
                      src={poster.generatedImageUrl}
                      alt={poster.formData?.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      কোনো ছবি পাওয়া যায়নি
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant={poster.status === 'completed' ? 'success' : 'warning'}>
                      {poster.status === 'completed' ? 'প্রস্তুত' : 'প্রসেসিং'}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-text-primary font-bangla truncate mb-1">
                  {poster.formData?.headline || 'নামবিহীন পোস্টার'}
                </h3>
                <p className="text-xs text-text-muted font-bangla truncate">
                  {poster.formData?.requesterName} • {poster.formData?.party || 'সাধারণ'}
                </p>
                <p className="text-[10px] text-text-subtle mt-2">
                  {new Date(poster.createdAt).toLocaleDateString('bn-BD', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 border-t border-border mt-4 pt-3">
                <Link href={`/preview/${poster._id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bangla gap-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    দেখুন
                  </Button>
                </Link>
                {poster.generatedImageUrl && (
                  <a
                    href={poster.generatedImageUrl}
                    download={`Polipost_${poster._id}.png`}
                    className="p-2 rounded-lg border border-border text-text-subtle hover:text-primary hover:bg-surface-subtle transition-colors"
                    title="ডাউনলোড"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(poster._id)}
                  className="p-2 rounded-lg text-text-subtle hover:text-status-danger hover:bg-status-danger-bg transition-colors"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
