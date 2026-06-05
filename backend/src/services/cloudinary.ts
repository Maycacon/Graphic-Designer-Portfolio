import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { UploadResponse, ProjectType } from '../types/index.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  file: Express.Multer.File,
  type: ProjectType
): Promise<UploadResponse> {
  const isVideo = file.mimetype.startsWith('video/');

  const uploadOptions: any = {
    folder: `portfolio/${type}`,
    resource_type: isVideo ? 'video' : 'image',
    public_id: `${type}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  };

  if (isVideo) {
    uploadOptions.video_sampling = 20;
    uploadOptions.quality = 'auto:eco';
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            type: isVideo ? 'video' : 'image',
          });
        }
      }
    );

    const fileStream = Readable.from(file.buffer);
    fileStream.pipe(stream);
  });
}
