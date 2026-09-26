'use client';

import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, Sparkles, Users, Crown, Shield, Circle, LayoutGrid } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { api } from '../../lib/api';
import { PhotoData } from './LiveCanvasPreview';

interface StepPhotosProps {
  photos: PhotoData[];
  onUpdatePhotos: (photos: PhotoData[]) => void;
  leaderCount: number;
  onChangeLeaderCount: (count: number) => void;
  leaderFrameStyle: 'oval' | 'circle' | 'arch' | 'shield' | 'cutout';
  onChangeLeaderFrameStyle: (style: 'oval' | 'circle' | 'arch' | 'shield' | 'cutout') => void;
}

export const StepPhotos: React.FC<StepPhotosProps> = ({
  photos,
  onUpdatePhotos,
  leaderCount,
  onChangeLeaderCount,
  leaderFrameStyle,
  onChangeLeaderFrameStyle,
}) => {
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  // Leader count options
  const countOptions = [
    { count: 1, label: '১ জন নেতা', desc: 'কেন্দ্রীয় প্রধান নেতা' },
    { count: 2, label: '২ জন নেতা', desc: 'যুগ্ম নেতৃত্ব' },
    { count: 3, label: '৩ জন নেতা', desc: 'ঐতিহ্যবাহী ত্রি-নেতৃত্ব' },
    { count: 0, label: 'কোনো নেতা নয়', desc: 'শুধু প্রার্থী / একক প্রচার' },
  ];

  // Styling options
  const frameStyleOptions: Array<{
    id: 'oval' | 'circle' | 'arch' | 'shield' | 'cutout';
    label: string;
    icon: any;
    desc: string;
  }> = [
    { id: 'oval', label: 'স্বর্ণালী উপবৃত্ত', icon: Crown, desc: 'ঐতিহ্যবাহী রাজকীয় ডাবল গোল্ড ওভাল' },
    { id: 'circle', label: 'গোলাকার মেডেলিয়ন', icon: Circle, desc: 'আধুনিক সার্কুলার মেডেল রিং' },
    { id: 'arch', label: 'রাজকীয় খিলান', icon: LayoutGrid, desc: 'মুঘল খিলান গম্বুজ আকৃতি' },
    { id: 'shield', label: 'জাতীয় শিল্ড ক্রেস্ট', icon: Shield, desc: 'সাহসী দেশপ্রেমিক শিল্ড ফ্রেম' },
    { id: 'cutout', label: 'কাটআউট ও আভা', icon: Sparkles, desc: 'আধুনিক বিলবোর্ড আভা মোড' },
  ];

  // Dynamic slot generation based on leaderCount
  let dynamicSlots = [];

  if (leaderCount === 1) {
    dynamicSlots.push({
      id: 'leader_1',
      label: 'প্রধান নেতা (শীর্ষ কেন্দ্র)',
      desc: 'পোস্টারের উপরের কেন্দ্রবিন্দুতে প্রধান ফ্রেমে থাকবে',
    });
  } else if (leaderCount === 2) {
    dynamicSlots.push(
      {
        id: 'leader_1',
        label: 'শীর্ষ নেতা ১ (বাম পার্শ্ব)',
        desc: 'পোস্টারের শীর্ষ বাম পাশের ফ্রেমে থাকবে',
      },
      {
        id: 'leader_2',
        label: 'শীর্ষ নেতা ২ (ডান পার্শ্ব)',
        desc: 'পোস্টারের শীর্ষ ডান পাশের ফ্রেমে থাকবে',
      }
    );
  } else if (leaderCount === 3) {
    dynamicSlots.push(
      {
        id: 'leader_1',
        label: 'প্রধান নেতা (শীর্ষ কেন্দ্র)',
        desc: 'পোস্টারের উপরের কেন্দ্রবিন্দুতে প্রধান ফ্রেমে থাকবে',
      },
      {
        id: 'leader_2',
        label: 'শীর্ষ নেতা ২ (বাম পার্শ্ব)',
        desc: 'বাম পাশের পার্শ্ববর্তী ফ্রেমে থাকবে',
      },
      {
        id: 'leader_3',
        label: 'শীর্ষ নেতা ৩ (ডান পার্শ্ব)',
        desc: 'ডান পাশের পার্শ্ববর্তী ফ্রেমে থাকবে',
      }
    );
  }

  // Always include candidate photo slot
  dynamicSlots.push({
    id: 'requester',
    label: 'আপনার ছবি / প্রার্থীর ছবি',
    desc: 'পোস্টারের নিচের প্রচারে ব্যানার বক্সে প্রদর্শিত হবে',
  });

  const handleFileUpload = async (slotId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে একটি ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('ছবির সাইজ ১০MB এর বেশি হতে পারবে না।');
      return;
    }

    // Instant local preview for immediate canvas update
    const localBlobUrl = URL.createObjectURL(file);
    const existing = photos.filter((p) => p.slotId !== slotId);
    onUpdatePhotos([...existing, { slotId, originalUrl: localBlobUrl, useCutout: false }]);

    try {
      setUploadingSlot(slotId);
      const formData = new FormData();
      formData.append('photo', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data.url) {
        onUpdatePhotos([...existing, { slotId, originalUrl: res.data.url, useCutout: false }]);
      }
    } catch (error: any) {
      console.error('Photo upload failed:', error);
      const msg = error?.response?.data?.message || 'ছবি আপলোড করতে সমস্যা হয়েছে।';
      alert(msg);
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleRemovePhoto = (slotId: string) => {
    onUpdatePhotos(photos.filter((p) => p.slotId !== slotId));
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-bold text-text-primary font-bangla">৩. নেতাদের ছবি ও উপস্থাপনা শৈলী</h2>
        <p className="text-sm text-text-muted font-bangla">
          নেতাদের সংখ্যা ও ফ্রেমের শৈলী নির্ধারণ করুন এবং ছবি আপলোড করুন।
        </p>
      </div>

      {/* Control 1: Leader Count Selection */}
      <div className="bg-surface p-4 rounded-xl border border-border space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-text-primary font-bangla flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            পোস্টারে নেতার সংখ্যা নির্ধারণ করুন
          </label>
          <Badge variant="primary">{leaderCount === 0 ? 'শুধু প্রার্থী' : `${leaderCount} জন নেতা`}</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {countOptions.map((opt) => {
            const isSelected = leaderCount === opt.count;
            return (
              <button
                key={opt.count}
                type="button"
                onClick={() => onChangeLeaderCount(opt.count)}
                className={`p-3 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/25 shadow-sm'
                    : 'border-border bg-surface-subtle hover:border-border-strong hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold font-bangla ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                    {opt.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>
                <span className="text-[11px] text-text-subtle font-bangla">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control 2: Frame Styling Selection */}
      <div className="bg-surface p-4 rounded-xl border border-border space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-text-primary font-bangla flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            ছবির ফ্রেম ও উপস্থাপনা শৈলী (Showcase Style)
          </label>
          <span className="text-xs text-text-subtle font-bangla">৫ টি বৈচিত্র্যময় স্টাইল</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {frameStyleOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = leaderFrameStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeLeaderFrameStyle(opt.id)}
                className={`p-3 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/25 shadow-sm'
                    : 'border-border bg-surface-subtle hover:border-border-strong hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      isSelected ? 'bg-primary text-white' : 'bg-surface text-text-muted border border-border'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-xs font-bold font-bangla ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                    {opt.label}
                  </span>
                </div>
                <span className="text-[10px] text-text-subtle line-clamp-1">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control 3: Photo Upload Slots */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-text-primary font-bangla">ছবি আপলোড স্লটসমূহ</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dynamicSlots.map((slot) => {
            const photo = photos.find((p) => p.slotId === slot.id);
            const isUploading = uploadingSlot === slot.id;

            return (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                  photo
                    ? 'border-primary/40 bg-surface'
                    : 'border-border bg-surface-subtle/50 hover:border-border-strong'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-bold text-text-primary font-bangla">{slot.label}</h4>
                    {photo ? (
                      <Badge variant="success">আপলোড সম্পন্ন</Badge>
                    ) : (
                      <Badge variant="neutral">ঐচ্ছিক</Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-subtle mb-3">{slot.desc}</p>
                </div>

                {photo ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-surface-subtle p-2 rounded-lg border border-border">
                      <img
                        src={photo.originalUrl}
                        alt={slot.label}
                        className="w-14 h-14 object-cover rounded-md border border-border flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-text-primary block truncate">
                          ছবি সফলভাবে যুক্ত হয়েছে
                        </span>
                        <span className="text-[11px] text-text-subtle">
                          ফ্রেম: {frameStyleOptions.find((f) => f.id === leaderFrameStyle)?.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(slot.id)}
                        className="p-1.5 rounded-lg text-text-subtle hover:text-status-danger hover:bg-status-danger-bg transition-colors"
                        title="ছবি মুছুন"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary-subtle/30 rounded-lg p-5 cursor-pointer transition-all duration-150 group">
                      <Upload className="w-6 h-6 text-text-subtle group-hover:text-primary mb-2 transition-colors" />
                      <span className="text-xs font-bold text-text-primary font-bangla group-hover:text-primary">
                        {isUploading ? 'আপলোড হচ্ছে...' : 'ছবি নির্বাচন করুন'}
                      </span>
                      <span className="text-[10px] text-text-subtle mt-0.5">JPG, PNG বা WEBP (সর্বোচ্চ ১০MB)</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(slot.id, file);
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
