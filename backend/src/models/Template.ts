import mongoose, { Document, Schema } from 'mongoose';

export interface IPhotoSlot {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'oval' | 'circle' | 'rect' | 'cutout' | 'arch' | 'shield';
  borderWidth?: number;
  borderColor?: string;
}

export interface ITextSlot {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  fontSize: number;
  fontWeight: string | number;
  color: string;
  align: 'left' | 'center' | 'right';
  fontFamily: string;
  textTransform?: string;
  shadow?: string;
}

export interface ITemplateLayoutConfig {
  dimensions: {
    width: number;
    height: number;
  };
  photoSlots: IPhotoSlot[];
  textSlots: ITextSlot[];
  bgColor?: string;
  bgGradient?: string;
  bgImageUrl?: string;
  overlaySvg?: string;
  bannerColor?: string;
  footerColor?: string;
}

export interface ITemplate extends Document {
  title: string;
  slug: string;
  occasionType: 'victory_day' | 'mourning' | 'campaign' | 'greetings' | 'eid' | 'international' | 'anniversary';
  partyMotif: 'neutral' | 'bnp' | 'al' | 'general_bangladesh' | 'international' | 'civic' | 'progressive';
  thumbnailUrl: string;
  layoutConfig: ITemplateLayoutConfig;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSlotSchema = new Schema<IPhotoSlot>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    shape: { type: String, enum: ['oval', 'circle', 'rect', 'cutout', 'arch', 'shield'], default: 'oval' },
    borderWidth: { type: Number, default: 0 },
    borderColor: { type: String },
  },
  { _id: false }
);

const TextSlotSchema = new Schema<ITextSlot>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number },
    fontSize: { type: Number, required: true },
    fontWeight: { type: Schema.Types.Mixed, default: 'bold' },
    color: { type: String, required: true },
    align: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
    fontFamily: { type: String, default: 'Hind Siliguri' },
    textTransform: { type: String },
    shadow: { type: String },
  },
  { _id: false }
);

const TemplateLayoutConfigSchema = new Schema<ITemplateLayoutConfig>(
  {
    dimensions: {
      width: { type: Number, default: 1200 },
      height: { type: Number, default: 1600 },
    },
    photoSlots: [PhotoSlotSchema],
    textSlots: [TextSlotSchema],
    bgColor: { type: String },
    bgGradient: { type: String },
    bgImageUrl: { type: String },
    overlaySvg: { type: String },
    bannerColor: { type: String },
    footerColor: { type: String },
  },
  { _id: false }
);

const TemplateSchema = new Schema<ITemplate>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    occasionType: {
      type: String,
      enum: ['victory_day', 'mourning', 'campaign', 'greetings', 'eid', 'international', 'anniversary'],
      required: true,
      index: true,
    },
    partyMotif: {
      type: String,
      enum: ['neutral', 'bnp', 'al', 'general_bangladesh', 'international', 'civic', 'progressive'],
      default: 'neutral',
    },
    thumbnailUrl: { type: String, default: '' },
    layoutConfig: { type: TemplateLayoutConfigSchema, required: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const Template = mongoose.model<ITemplate>('Template', TemplateSchema);
