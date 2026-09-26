'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Wand2, Loader2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StepOccasion, TemplateItem } from '../../components/poster/StepOccasion';
import { StepDetails } from '../../components/poster/StepDetails';
import { StepPhotos } from '../../components/poster/StepPhotos';
import { LiveCanvasPreview, PosterData, PhotoData } from '../../components/poster/LiveCanvasPreview';

function CreatePosterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [occasionType, setOccasionType] = useState<string>(
    searchParams.get('occasion') || 'victory_day'
  );

  const [formData, setFormData] = useState<PosterData>({
    occasionType: 'victory_day',
    headline: 'মহান বিজয় দিবস উপলক্ষে শুভেচ্ছা ও অভিনন্দন',
    slogan: 'লাখো শহীদের রক্তে অর্জিত স্বাধীন বাংলাদেশে বিজয়ের শুভেচ্ছা।',
    requesterName: user?.name || '',
    designation: 'সভাপতি / কর্মী',
    party: 'বাংলাদেশ জাতীয়তাবাদী দল',
    unionThanaDistrict: 'ঢাকা মহানগর',
    creditLine: 'প্রচারে: দলীয় সর্বস্তরের নেতাকর্মী ও শুভানুধ্যায়ীবৃন্দ',
    leaderCount: 3,
    leaderFrameStyle: 'oval',
    fontFamily: 'Anek Bangla',
    footerStyle: 'classic',
    candidatePosition: 'right',
    footerColorMode: 'dark',
  });

  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Gemini Full Poster Auto-Generation State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuccessNote, setAiSuccessNote] = useState<string | null>(null);

  const handleGenerateWithGemini = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim()) return;

    try {
      setIsAiGenerating(true);
      setAiSuccessNote(null);
      setErrorMsg(null);

      const res = await api.post('/posters/generate-full', { prompt: promptToUse });
      if (res.data?.success && res.data.data) {
        const d = res.data.data;
        setFormData((prev) => ({
          ...prev,
          occasionType: d.occasionType || prev.occasionType,
          headline: d.headline || prev.headline,
          slogan: d.slogan || prev.slogan,
          party: d.party || prev.party,
          requesterName: d.requesterName || prev.requesterName,
          designation: d.designation || prev.designation,
          unionThanaDistrict: d.unionThanaDistrict || prev.unionThanaDistrict,
          creditLine: d.creditLine || prev.creditLine,
          leaderCount: typeof d.leaderCount === 'number' ? d.leaderCount : prev.leaderCount,
          leaderFrameStyle: d.leaderFrameStyle || prev.leaderFrameStyle,
          fontFamily: d.fontFamily || prev.fontFamily,
          footerStyle: d.footerStyle || prev.footerStyle,
          candidatePosition: d.candidatePosition || prev.candidatePosition,
          footerColorMode: d.footerColorMode || prev.footerColorMode,
        }));

        setOccasionType(d.occasionType || 'victory_day');

        // Match template by recommended slug or occasion
        if (d.recommendedTemplateSlug) {
          const tmpl = templates.find((t) => t.slug === d.recommendedTemplateSlug);
          if (tmpl) setSelectedTemplate(tmpl);
        } else {
          const match = templates.find((t) => t.occasionType === d.occasionType);
          if (match) setSelectedTemplate(match);
        }

        setAiSuccessNote(d.aiExplanation || 'জেমিনি এআই সফলভাবে আপনার সম্পূর্ণ পোস্টার ডিজাইন করেছে!');
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.3 },
        });
      }
    } catch (err: any) {
      console.error('Gemini full generation error:', err);
      setErrorMsg('জেমিনি এআই দিয়ে পোস্টার তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get('/templates');
        if (res.data?.success && res.data.templates?.length > 0) {
          setTemplates(res.data.templates);
          // Set initial template
          const match = res.data.templates.find((t: TemplateItem) => t.occasionType === occasionType);
          setSelectedTemplate(match || res.data.templates[0]);
        }
      } catch (err) {
        console.error('Error fetching templates, using local fallback:', err);
        // Fallback templates
        const fallback: TemplateItem[] = [
          {
            _id: 'victory-1',
            title: 'মহান বিজয় দিবস - জাতীয় স্মৃতিসৌধ থিম',
            slug: 'victory-day-memorial',
            occasionType: 'victory_day',
            thumbnailUrl:
              'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop',
            layoutConfig: { bgColor: '#043927', bannerColor: '#c9182b' },
          },
          {
            _id: 'mourning-1',
            title: 'গভীর শোক ও বিনম্র শ্রদ্ধাঞ্জলি',
            slug: 'memorial-tribute',
            occasionType: 'mourning',
            thumbnailUrl:
              'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
            layoutConfig: { bgColor: '#18181b', bannerColor: '#3f3f46' },
          },
          {
            _id: 'campaign-1',
            title: 'নির্বাচনী প্রচার ও বিজয়ের শুভেচ্ছা',
            slug: 'election-campaign-banner',
            occasionType: 'campaign',
            thumbnailUrl:
              'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop',
            layoutConfig: { bgColor: '#064e3b', bannerColor: '#dc2626' },
          },
        ];
        setTemplates(fallback);
        setSelectedTemplate(fallback[0]);
      }
    };
    fetchTemplates();
  }, [occasionType]);

  const handleFormFieldChange = (field: keyof PosterData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectOccasion = (type: string) => {
    setOccasionType(type);
    setFormData((prev) => {
      let defaultHeadline = 'মহান বিজয় দিবস উপলক্ষে শুভেচ্ছা ও অভিনন্দন';
      let defaultSlogan = 'লাখো শহীদের রক্তে অর্জিত স্বাধীন বাংলাদেশে বিজয়ের শুভেচ্ছা।';

      if (type === 'mourning') {
        defaultHeadline = 'বিনম্র শ্রদ্ধা ও ভালোবাসায় স্মরণ করছি';
        defaultSlogan = 'আপনার আদর্শ ও আত্মত্যাগ চিরকাল আমাদের পথ দেখাবে।';
      } else if (type === 'campaign') {
        defaultHeadline = 'উন্নয়ন ও অগ্রযাত্রায় আপনার মূল্যবান ভোট দিন';
        defaultSlogan = 'জনগণের সেবায় সততা ও সাহসের সাথে আমরা প্রস্তুত।';
      } else if (type === 'eid') {
        defaultHeadline = 'পবিত্র ঈদুল ফিতরের শুভেচ্ছা ও অভিনন্দন';
        defaultSlogan = 'ঈদ বয়ে আনুক সবার জীবনে অনাবিল শান্তি ও সমৃদ্ধি—ঈদ মোবারক!';
      } else if (type === 'international') {
        defaultHeadline = 'পরিবর্তন ও প্রগতির প্রত্যয় (HOPE)';
        defaultSlogan = 'জনগণের ঐক্য ও অধিকার প্রতিষ্ঠায় নতুন দিনের সূচনা।';
      }

      return {
        ...prev,
        occasionType: type,
        headline: defaultHeadline,
        slogan: defaultSlogan,
      };
    });

    const match = templates.find((t) => t.occasionType === type);
    if (match) setSelectedTemplate(match);
  };

  const handleGeneratePoster = async () => {
    try {
      setIsGenerating(true);
      setErrorMsg(null);

      // If user is not logged in, prompt or redirect
      if (!user) {
        // Save current draft to sessionStorage
        sessionStorage.setItem('polipost_pending_draft', JSON.stringify({ formData, photos, templateId: selectedTemplate?._id }));
        router.push('/login?redirect=/create');
        return;
      }

      const res = await api.post('/posters', {
        templateId: selectedTemplate?._id || templates[0]?._id,
        formData,
        uploadedPhotos: photos,
      });

      if (res.data?.success && res.data.poster?._id) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        router.push(`/preview/${res.data.poster._id}`);
      } else {
        setErrorMsg(res.data?.message || 'পোস্টার জেনারেশন ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      console.error('Error creating poster:', err);
      setErrorMsg(err.response?.data?.message || 'পোস্টার রেন্ডারিংয়ে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    { num: 1, title: 'উপলক্ষ ও ডিজাইন' },
    { num: 2, title: 'তথ্য ও বক্তব্য' },
    { num: 3, title: 'ছবি আপলোড' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Wizard Header Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-xl mx-auto mb-3">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                    currentStep === s.num
                      ? 'bg-primary text-white shadow-md shadow-primary/30 ring-4 ring-primary/20'
                      : currentStep > s.num
                      ? 'bg-status-success text-white'
                      : 'bg-surface-subtle border border-border text-text-muted'
                  }`}
                >
                  {currentStep > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className="text-xs font-semibold text-text-primary mt-1.5 font-bangla">
                  {s.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors duration-200 ${
                    currentStep > idx + 1 ? 'bg-status-success' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Gemini AI Auto-Draft Assistant Banner */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-surface to-accent-subtle/20 border border-primary/25 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                <Sparkles className="w-3.5 h-3.5" />
                জেমিনি এআই
              </span>
              <span className="text-xs text-text-subtle font-bangla font-semibold">
                স্বয়ংক্রিয় সম্পূর্ণ পোস্টার নির্মাতা
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-text-primary font-bangla">
              সম্পূর্ণ পোস্টার এআই (Gemini) দিয়ে তৈরি করুন
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-bangla mt-0.5">
              আপনার উপলক্ষ, পদবী বা পোস্টারের বিবরণ লিখুন—জেমিনি এআই তাৎক্ষণিকভাবে উপযুক্ত টেমপ্লেট, স্লোগান ও পূর্ণাঙ্গ ডিজাইন সাজিয়ে দেবে।
            </p>
          </div>
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateWithGemini();
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="যেমন: '১৬ই ডিসেম্বর বিজয় দিবসে আওয়ামী লীগের সাধারণ সম্পাদক হিসেবে শুভেচ্ছা পোস্টার'..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-subtle text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary font-bangla"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={isAiGenerating || !aiPrompt.trim()}
            className="gap-2 px-6 py-3 font-bangla whitespace-nowrap shadow-md shadow-primary/25"
          >
            {isAiGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                এআই সাজাচ্ছে...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                এআই দিয়ে সাজান
              </>
            )}
          </Button>
        </form>

        {/* Quick Inspiration Pills */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs text-text-subtle font-bangla font-medium">ঝটপট চেষ্টা করুন:</span>
          {[
            '১৬ই ডিসেম্বর মহান বিজয় দিবস',
            '২১শে ফেব্রুয়ারি শহীদ মিনার শ্রদ্ধাঞ্জলি',
            'আসন্ন নির্বাচনে চেয়ারম্যান পদে ভোট প্রার্থনা',
            'দলীয় প্রতিষ্ঠা বার্ষিকীর ঐতিহাসিক সম্মেলন',
          ].map((promptSuggestion) => (
            <button
              key={promptSuggestion}
              type="button"
              onClick={() => {
                setAiPrompt(promptSuggestion);
                handleGenerateWithGemini(promptSuggestion);
              }}
              disabled={isAiGenerating}
              className="text-xs font-bangla px-3 py-1 rounded-full bg-surface-subtle hover:bg-primary/10 hover:text-primary border border-border text-text-muted transition-colors disabled:opacity-50"
            >
              ✨ {promptSuggestion}
            </button>
          ))}
        </div>

        {/* AI Success Feedback Note */}
        {aiSuccessNote && (
          <div className="mt-3.5 p-3 rounded-xl bg-status-success-bg border border-status-success/30 text-status-success text-xs font-bangla flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{aiSuccessNote}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Form on Left, Live Canvas Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Card */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-status-danger-bg border border-status-danger/30 text-status-danger text-sm flex items-start gap-2.5 font-bangla">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {currentStep === 1 && (
              <StepOccasion
                templates={templates}
                selectedTemplateId={selectedTemplate?._id || ''}
                onSelectTemplate={(tmpl) => setSelectedTemplate(tmpl)}
                occasionType={occasionType}
                onChangeOccasion={handleSelectOccasion}
              />
            )}

            {currentStep === 2 && (
              <StepDetails formData={formData} onChange={handleFormFieldChange} />
            )}

            {currentStep === 3 && (
              <StepPhotos
                photos={photos}
                onUpdatePhotos={(p) => setPhotos(p)}
                leaderCount={formData.leaderCount ?? 3}
                onChangeLeaderCount={(cnt) =>
                  setFormData((prev) => ({ ...prev, leaderCount: cnt }))
                }
                leaderFrameStyle={formData.leaderFrameStyle || 'oval'}
                onChangeLeaderFrameStyle={(st) =>
                  setFormData((prev) => ({ ...prev, leaderFrameStyle: st }))
                }
              />
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-border mt-8 pt-5">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="gap-2 font-bangla"
                >
                  <ArrowLeft className="w-4 h-4" />
                  পূর্ববর্তী ধাপ
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="gap-2 font-bangla"
                >
                  পরবর্তী ধাপ
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="accent"
                  size="lg"
                  isLoading={isGenerating}
                  onClick={handleGeneratePoster}
                  className="gap-2 font-bangla shadow-md"
                >
                  <Sparkles className="w-5 h-5" />
                  প্রিন্ট-রেডি পোস্টার জেনারেট করুন
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Live Preview Sticky Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary font-bangla mb-3 flex items-center justify-between">
              <span>লাইভ ক্যানভাস প্রিভিউ</span>
              <span className="text-[11px] text-primary font-semibold">৩০০ DPI প্রিন্ট রেডি</span>
            </h3>

            <LiveCanvasPreview
              formData={formData}
              photos={photos}
              bgColor={selectedTemplate?.layoutConfig?.bgColor}
              bannerColor={selectedTemplate?.layoutConfig?.bannerColor}
              templateSlug={selectedTemplate?.slug}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreatePosterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-text-primary font-bangla">লোড হচ্ছে...</p>
        </div>
      }
    >
      <CreatePosterContent />
    </Suspense>
  );
}
