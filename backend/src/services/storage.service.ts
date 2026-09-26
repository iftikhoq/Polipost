import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env.js';

const isCloudinaryConfigured =
  Boolean(ENV.CLOUDINARY.CLOUD_NAME && ENV.CLOUDINARY.API_KEY && ENV.CLOUDINARY.API_SECRET);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY.CLOUD_NAME,
    api_key: ENV.CLOUDINARY.API_KEY,
    api_secret: ENV.CLOUDINARY.API_SECRET,
  });
}

// Ensure local uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface UploadResult {
  url: string;
  publicId?: string;
}

export const uploadFile = async (
  file: Express.Multer.File,
  folder = 'polipost_posters'
): Promise<UploadResult> => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  // Local filesystem fallback
  const ext = path.extname(file.originalname) || '.png';
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = path.join(UPLOADS_DIR, fileName);

  await fs.promises.writeFile(filePath, file.buffer);
  const localUrl = `http://localhost:${ENV.PORT}/uploads/${fileName}`;

  return {
    url: localUrl,
    publicId: fileName,
  };
};

export const uploadBuffer = async (
  buffer: Buffer,
  fileName: string,
  folder = 'polipost_exports'
): Promise<UploadResult> => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          public_id: fileName.replace(/\.[^/.]+$/, ''),
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload buffer failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  const filePath = path.join(UPLOADS_DIR, fileName);
  await fs.promises.writeFile(filePath, buffer);
  const localUrl = `http://localhost:${ENV.PORT}/uploads/${fileName}`;

  return {
    url: localUrl,
    publicId: fileName,
  };
};
