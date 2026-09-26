import mongoose, { Document, Schema } from 'mongoose';

export interface IGenerationLog extends Document {
  posterId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  promptUsed: string;
  tokensUsed: number;
  renderLatencyMs: number;
  success: boolean;
  error?: string;
  createdAt: Date;
}

const GenerationLogSchema = new Schema<IGenerationLog>(
  {
    posterId: { type: Schema.Types.ObjectId, ref: 'Poster', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    promptUsed: { type: String, default: '' },
    tokensUsed: { type: Number, default: 0 },
    renderLatencyMs: { type: Number, default: 0 },
    success: { type: Boolean, required: true },
    error: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const GenerationLog = mongoose.model<IGenerationLog>('GenerationLog', GenerationLogSchema);
