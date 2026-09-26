'use client';

import React from 'react';
import { Sparkles, Flag, HeartHandshake, Vote, Moon, Globe, Award } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export interface TemplateItem {
  _id: string;
  title: string;
  slug: string;
  occasionType: string;
  thumbnailUrl: string;
  layoutConfig: any;
}

interface StepOccasionProps {
  templates: TemplateItem[];
  selectedTemplateId: string;
  onSelectTemplate: (template: TemplateItem) => void;
  occasionType: string;
  onChangeOccasion: (type: string) => void;
}

export const StepOccasion: React.FC<StepOccasionProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  occasionType,
  onChangeOccasion,
}) => {
  const occasions = [
    { id: 'victory_day', label: 'মহান বিজয় দিবস', icon: Flag, desc: 'জাতীয় স্মৃতিসৌধ ও বজ্রমুষ্টি থিম' },
    { id: 'mourning', label: 'শোক ও শহীদ দিবস', icon: HeartHandshake, desc: '২১শে ফেব্রুয়ারি শহীদ মিনার ও বিনম্র শ্রদ্ধা' },
    { id: 'campaign', label: 'নির্বাচনী প্রচার', icon: Vote, desc: 'তারুণ্যের গণজোয়ার ও মার্কা প্রতীক' },
    { id: 'anniversary', label: 'প্রতিষ্ঠা বার্ষিকী', icon: Award, desc: 'দলীয় প্রতিষ্ঠা বার্ষিকী ও ঐতিহাসিক সম্মেলন' },
    { id: 'eid', label: 'ঈদ ও উৎসব শুভেচ্ছা', icon: Moon, desc: 'পবিত্র ঈদ, নববর্ষ ও সামাজিক শুভেচ্ছা' },
    { id: 'international', label: 'বিশ্ববিখ্যাত শৈলী', icon: Globe, desc: 'কনস্ট্রাক্টিভিস্ট, হোপ পপ-আর্ট ও সুইস' },
  ];

  const filteredTemplates = templates.filter(
    (t) => t.occasionType === occasionType || occasionType === 'all'
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary font-bangla">১. পোস্টারের দিবস ও উপলক্ষ নির্ধারণ করুন</h2>
        <p className="text-sm text-text-muted font-bangla">
          যে অনুষ্ঠানের জন্য পোস্টার তৈরি করতে চান তা নির্বাচন করুন।
        </p>
      </div>

      {/* Occasion Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {occasions.map((item) => {
          const Icon = item.icon;
          const isSelected = occasionType === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeOccasion(item.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-primary bg-primary-subtle ring-2 ring-primary/30 shadow-sm'
                  : 'border-border bg-surface hover:border-border-strong hover:bg-surface-subtle'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-primary text-white' : 'bg-surface-subtle text-text-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && <Badge variant="primary">বাছাইকৃত</Badge>}
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary font-bangla">{item.label}</h4>
                <p className="text-[11px] text-text-subtle line-clamp-1 mt-0.5">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Available Templates for this occasion */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-text-primary font-bangla">উপলব্ধ টেমপ্লেট ডিজাইনসমূহ</h3>
          <span className="text-xs text-text-subtle font-bangla">{filteredTemplates.length} টি ডিজাইন উপলব্ধ</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplateId === template._id;
            return (
              <Card
                key={template._id}
                hoverable
                onClick={() => onSelectTemplate(template)}
                className={`p-4 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/40 bg-primary-subtle/20'
                    : 'border-border'
                }`}
              >
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-28 rounded-lg overflow-hidden bg-slate-900 border border-border flex-shrink-0 relative">
                    <img
                      src={template.thumbnailUrl}
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant={template.occasionType === 'mourning' ? 'neutral' : template.occasionType === 'international' ? 'accent' : 'primary'}>
                        {template.occasionType === 'victory_day'
                          ? 'বিজয় দিবস'
                          : template.occasionType === 'mourning'
                          ? 'শোক'
                          : template.occasionType === 'campaign'
                          ? 'প্রচার'
                          : template.occasionType === 'international'
                          ? 'গ্লোবাল শৈলী'
                          : 'উৎসব'}
                      </Badge>
                      {isSelected && <Badge variant="success">নির্বাচিত</Badge>}
                    </div>
                    <h4 className="text-sm font-bold text-text-primary font-bangla truncate">
                      {template.title}
                    </h4>
                    <p className="text-xs text-text-muted mt-1 font-bangla line-clamp-2">
                      শীর্ষ নেতা ও প্রার্থীর ছবি স্লটসহ প্রমিত রাজনৈতিক অনুপাত (১২০০×১৬০০)।
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
