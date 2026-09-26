import mongoose, { Document, Schema } from 'mongoose';

export interface IUploadedPhoto {
  slotId: string;
  originalUrl: string;
  cutoutUrl?: string;
  useCutout?: boolean;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface IPosterFormData {
  occasionType: string;
  headline: string;
  slogan: string;
  requesterName: string;
  designation: string;
  party: string;
  unionThanaDistrict?: string;
  creditLine: string;
  leaderCount?: number;
  leaderFrameStyle?: string;
  fontFamily?: string;
  footerStyle?: string;
  candidatePosition?: string;
  footerColorMode?: string;
}

export interface IPoster extends Document {
  userId: mongoose.Types.ObjectId;
  templateId: mongoose.Types.ObjectId;
  formData: IPosterFormData;
  uploadedPhotos: IUploadedPhoto[];
  aiSuggestions: {
    suggestedSlogans?: string[];
    colorThemeNotes?: string;
  };
  generatedImageUrl?: string;
  highResPdfUrl?: string;
  thumbnailUrl?: string;
  status: 'draft' | 'queued' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  error?: string;
  moderationFlags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UploadedPhotoSchema = new Schema<IUploadedPhoto>(
  {
    slotId: { type: String, required: true },
    originalUrl: { type: String, required: true },
    cutoutUrl: { type: String },
    useCutout: { type: Boolean, default: false },
    zoom: { type: Number, default: 1 },
    offsetX: { type: Number, default: 0 },
    offsetY: { type: Number, default: 0 },
  },
  { _id: false }
);

const PosterFormDataSchema = new Schema<IPosterFormData>(
  {
    occasionType: { type: String, required: true },
    headline: { type: String, required: true },
    slogan: { type: String, default: '' },
    requesterName: { type: String, required: true },
    designation: { type: String, default: '' },
    party: { type: String, default: '' },
    unionThanaDistrict: { type: String, default: '' },
    creditLine: { type: String, default: 'প্রচারে: এলাকাবাসী ও দলীয় সর্বস্তরের নেতাকর্মীবৃন্দ' },
    leaderCount: { type: Number, default: 3 },
    leaderFrameStyle: { type: String, default: 'oval' },
    fontFamily: { type: String, default: 'Anek Bangla' },
    footerStyle: { type: String, default: 'classic' },
    candidatePosition: { type: String, default: 'right' },
    footerColorMode: { type: String, default: 'dark' },
  },
  { _id: false }
);

const PosterSchema = new Schema<IPoster>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true, index: true },
    formData: { type: PosterFormDataSchema, required: true },
    uploadedPhotos: [UploadedPhotoSchema],
    aiSuggestions: {
      suggestedSlogans: [{ type: String }],
      colorThemeNotes: { type: String },
    },
    generatedImageUrl: { type: String },
    highResPdfUrl: { type: String },
    thumbnailUrl: { type: String },
    status: {
      type: String,
      enum: ['draft', 'queued', 'processing', 'completed', 'failed'],
      default: 'draft',
      index: true,
    },
    retryCount: { type: Number, default: 0 },
    error: { type: String },
    moderationFlags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Poster = mongoose.model<IPoster>('Poster', PosterSchema);
