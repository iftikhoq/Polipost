'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Wand2,
  Type,
  Layout,
  AlignLeft,
  AlignRight,
  AlignCenter,
  Palette,
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { api } from '../../lib/api';
import { PosterData } from './LiveCanvasPreview';

interface StepDetailsProps {
  formData: PosterData;
  onChange: (field: keyof PosterData, value: string) => void;
}

export const StepDetails: React.FC<StepDetailsProps> = ({ formData, onChange }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Font options
  const fontOptions = [
    {
      id: 'Anek Bangla',
      name: 'Anek Bangla',
      subtitle: 'আধুনিক ও বলিষ্ঠ বোল্ড',
      sample: 'স্বাধীনতা ও সার্বভৌমত্ব',
      fontClass: 'font-["Anek_Bangla"]',
    },
    {
      id: 'Hind Siliguri',
      name: 'Hind Siliguri',
      subtitle: 'ক্লাসিক ও আনুষ্ঠানিক প্রেস',
      sample: 'গণমানুষের অধিকার ও চেতনা',
      fontClass: 'font-["Hind_Siliguri"]',
    },
    {
      id: 'Tiro Bangla',
      name: 'Tiro Bangla',
      subtitle: 'ঐতিহ্যবাহী সাহিত্যিক সেরিক',
      sample: 'অমর একুশের রক্তিম স্মৃতি',
      fontClass: 'font-["Tiro_Bangla"]',
    },
    {
      id: 'Noto Serif Bengali',
      name: 'Noto Serif Bengali',
      subtitle: 'রাজকীয় ও গম্ভীর সৌধ',
      sample: 'বিজয়ের গৌরবময় ইতিহাস',
      fontClass: 'font-["Noto_Serif_Bengali"]',
    },
    {
      id: 'Mina',
      name: 'Mina',
      subtitle: 'গতিশীল ও ক্যালিগ্রাফিক',
      sample: 'দৃপ্ত পদক্ষেপে এগিয়ে চলো',
      fontClass: 'font-["Mina"]',
    },
  ];

  // Footer layout styles
  const footerStyles = [
    {
      id: 'classic',
      label: 'ঐতিহ্যবাহী ডার্ক বার',
      desc: 'চিরাচরিত ফুল-উইডথ ডার্ক ব্যানার',
    },
    {
      id: 'floating',
      label: 'ফ্লোটিং গ্লাস কার্ড',
      desc: 'কার্ভড ও মার্জিত ভাসমান প্যানেল',
    },
    {
      id: 'split',
      label: 'স্প্লিট হিরো প্যানেল',
      desc: 'প্রার্থীর ছবি ও বক্তব্য কৌণিক বিভাজন',
    },
    {
      id: 'minimal',
      label: 'মিনিমালিস্ট লাইন',
      desc: 'স্বচ্ছ ব্যাকগ্রাউন্ডে হেয়ারলাইন বর্ডার',
    },
    {
      id: 'royal',
      label: 'রয়্যাল গোল্ডেন ক্রেস্ট',
      desc: 'সোনালী মেটালিক গ্রাফিক্স ও ব্যাজ',
    },
  ];

  // Candidate position options
  const positionOptions = [
    { id: 'right', label: 'ডানপাশে', icon: AlignRight },
    { id: 'left', label: 'বামপাশে', icon: AlignLeft },
    { id: 'center', label: 'কেন্দ্রে (Hero)', icon: AlignCenter },
  ];

  // Footer color modes
  const colorModeOptions = [
    { id: 'dark', label: 'ডিপ ব্ল্যাক (#000)' },
    { id: 'theme', label: 'থিমের সাথে ম্যাচিং' },
    { id: 'gold', label: 'রয়্যাল গোল্ড আভা' },
    { id: 'transparent', label: 'স্বচ্ছ / গ্লাস' },
  ];

  const handleFetchAiSlogans = async () => {
    try {
      setIsAiLoading(true);
      const res = await api.post('/posters/slogans', {
        occasionType: formData.occasionType,
        headline: formData.headline,
        party: formData.party,
        requesterName: formData.requesterName,
        designation: formData.designation,
      });

      if (res.data?.success && res.data.suggestions?.slogans) {
        setAiSuggestions(res.data.suggestions.slogans);
      }
    } catch (error) {
      console.error('Error fetching AI slogans:', error);
      setAiSuggestions([
        'লাখো শহীদের রক্তে অর্জিত স্বাধীন বাংলাদেশে বিজয়ের শুভেচ্ছা।',
        'ঐক্য, শান্তি ও সমৃদ্ধির প্রত্যয়ে আমাদের দৃঢ় অঙ্গীকার।',
        'জনগণের ভালোবাসা ও সেবায় আমাদের পথচলা।',
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentFont = formData.fontFamily || 'Anek Bangla';
  const currentFooterStyle = formData.footerStyle || 'classic';
  const currentPosition = formData.candidatePosition || 'right';
  const currentColorMode = formData.footerColorMode || 'dark';

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-bold text-text-primary font-bangla">২. তথ্য, বক্তব্য, ফন্ট ও ফুটার কাস্টমাইজেশন</h2>
        <p className="text-sm text-text-muted font-bangla">
          পোস্টারের টেক্সট লিখুন এবং ফন্ট ও নিচের ফুটার প্যানেলের শৈলী নিজের ইচ্ছেমতো সাজান।
        </p>
      </div>

      {/* Basic Text Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Headline */}
        <div className="sm:col-span-2">
          <Input
            label="মূল শিরোনাম (বাংলা)"
            placeholder="উদা: মহান বিজয় দিবস উপলক্ষে শুভেচ্ছা ও অভিনন্দন"
            value={formData.headline}
            onChange={(e) => onChange('headline', e.target.value)}
            className="font-bangla font-semibold text-base"
          />
        </div>

        {/* Party / Organization */}
        <div>
          <Input
            label="দলীয় / সংগঠনের নাম"
            placeholder="উদা: বাংলাদেশ আওয়ামী লীগ / বাংলাদেশ জাতীয়তাবাদী দল / বৈষম্যবিরোধী"
            value={formData.party}
            onChange={(e) => onChange('party', e.target.value)}
            className="font-bangla"
          />
        </div>

        {/* Requester Name */}
        <div>
          <Input
            label="আপনার নাম (প্রচারে)"
            placeholder="উদা: মোঃ আরিফুল ইসলাম"
            value={formData.requesterName}
            onChange={(e) => onChange('requesterName', e.target.value)}
            className="font-bangla font-semibold"
          />
        </div>

        {/* Designation */}
        <div>
          <Input
            label="পদবি"
            placeholder="উদা: সভাপতি / সাধারণ সম্পাদক / সদস্য"
            value={formData.designation}
            onChange={(e) => onChange('designation', e.target.value)}
            className="font-bangla"
          />
        </div>

        {/* Location */}
        <div>
          <Input
            label="ইউনিয়ন / থানা / জেলা"
            placeholder="উদা: মিরপুর থানা, ঢাকা"
            value={formData.unionThanaDistrict}
            onChange={(e) => onChange('unionThanaDistrict', e.target.value)}
            className="font-bangla"
          />
        </div>

        {/* Slogan with AI Assistance */}
        <div className="sm:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-text-primary tracking-wide">
              স্লোগান বা মূল বাণী
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isAiLoading}
              onClick={handleFetchAiSlogans}
              className="text-xs text-primary border-primary/30 hover:bg-primary-subtle font-bangla"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1 text-primary" />
              <span>Gemini AI স্লোগান সাজেশন</span>
            </Button>
          </div>

          <textarea
            rows={2}
            value={formData.slogan}
            onChange={(e) => onChange('slogan', e.target.value)}
            placeholder="উদা: বিজয়ের চেতনায় গড়ে তুলি সমৃদ্ধ নতুন বাংলাদেশ..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-bangla"
          />

          {/* AI Suggestions Pill Badges */}
          {aiSuggestions.length > 0 && (
            <div className="p-3 rounded-xl bg-primary-subtle/40 border border-primary/20 space-y-2">
              <span className="text-xs font-bold text-primary flex items-center gap-1 font-bangla">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini প্রস্তাবিত স্লোগানসমূহ (ক্লিক করে বসান):
              </span>
              <div className="space-y-1.5">
                {aiSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChange('slogan', sug)}
                    className="w-full text-left text-xs p-2 rounded-lg bg-surface hover:bg-primary hover:text-white border border-border text-text-primary transition-colors flex items-center justify-between group font-bangla"
                  >
                    <span>{sug}</span>
                    <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Credit Line */}
        <div className="sm:col-span-2">
          <Input
            label="প্রচারে ক্রেডিট লাইন"
            value={formData.creditLine}
            onChange={(e) => onChange('creditLine', e.target.value)}
            placeholder="প্রচারে: এলাকাবাসী ও দলীয় সর্বস্তরের নেতাকর্মীবৃন্দ"
            className="font-bangla text-xs"
          />
        </div>
      </div>

      {/* Feature 1: Font Selection Section */}
      <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-text-primary font-bangla flex items-center gap-2">
            <Type className="w-4 h-4 text-primary" />
            পোস্টারের বাংলা ফন্ট নির্বাচন করুন (Typography Style)
          </label>
          <Badge variant="primary">{currentFont}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {fontOptions.map((f) => {
            const isSelected = currentFont === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange('fontFamily', f.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/25 shadow-sm'
                    : 'border-border bg-surface-subtle hover:border-border-strong hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                    {f.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>
                <span className="text-[11px] text-text-subtle font-bangla mb-2">{f.subtitle}</span>
                <span
                  style={{ fontFamily: f.id }}
                  className="text-sm font-bold text-text-primary truncate block"
                >
                  {f.sample}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature 2: Bottom Section Customization */}
      <div className="p-5 rounded-2xl bg-surface border border-border space-y-5">
        <div>
          <label className="text-sm font-bold text-text-primary font-bangla flex items-center gap-2 mb-1">
            <Layout className="w-4 h-4 text-primary" />
            পোস্টারের নিচের অংশ (ফুটার প্যানেল) কাস্টমাইজেশন
          </label>
          <p className="text-xs text-text-subtle font-bangla">
            প্রার্থীর ছবি ও পরিচিতি বক্সের লেআউট শৈলী, ছবির পজিশন ও কালার মোড পরিবর্তন করুন।
          </p>
        </div>

        {/* 1. Footer Style */}
        <div>
          <span className="text-xs font-bold text-text-primary font-bangla block mb-2">
            প্যানেল লেআউট শৈলী (Layout Style):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {footerStyles.map((st) => {
              const isSelected = currentFooterStyle === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onChange('footerStyle', st.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/25'
                      : 'border-border bg-surface-subtle hover:border-border-strong hover:bg-surface'
                  }`}
                >
                  <span className={`text-xs font-bold font-bangla ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                    {st.label}
                  </span>
                  <span className="text-[10px] text-text-subtle line-clamp-1 mt-0.5">{st.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Candidate Position & Color Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Candidate Position */}
          <div>
            <span className="text-xs font-bold text-text-primary font-bangla block mb-2">
              প্রার্থীর ছবির অবস্থান (Position):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {positionOptions.map((pos) => {
                const Icon = pos.icon;
                const isSelected = currentPosition === pos.id;
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => onChange('candidatePosition', pos.id)}
                    className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 text-xs font-bold font-bangla transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-border bg-surface-subtle text-text-muted hover:border-border-strong hover:text-text-primary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pos.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Mode */}
          <div>
            <span className="text-xs font-bold text-text-primary font-bangla block mb-2">
              ফুটার ব্যাকগ্রাউন্ড কালার মোড:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {colorModeOptions.map((cm) => {
                const isSelected = currentColorMode === cm.id;
                return (
                  <button
                    key={cm.id}
                    type="button"
                    onClick={() => onChange('footerColorMode', cm.id)}
                    className={`py-2 px-2.5 rounded-lg border text-left text-xs font-bangla font-semibold truncate transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/25'
                        : 'border-border bg-surface-subtle text-text-muted hover:border-border-strong hover:text-text-primary'
                    }`}
                  >
                    {cm.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
