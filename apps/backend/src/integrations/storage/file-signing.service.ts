import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from './s3.service';

@Injectable()
export class FileSigningService {
  private readonly logger = new Logger(FileSigningService.name);
  private readonly allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif',
    'application/pdf',
  ];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor(private readonly s3Service: S3Service) {}

  async getUploadUrl(
    fileName: string,
    contentType: string,
    prefix: string,
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    if (!this.allowedMimeTypes.includes(contentType)) {
      throw new Error(`File type ${contentType} is not allowed`);
    }

    const key = this.s3Service.generateKey(prefix, fileName);
    const uploadUrl = await this.s3Service.getSignedUrl(key, 300); // 5 minutes
    const publicUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET}/${key}`;

    return { uploadUrl, key, publicUrl };
  }

  async getDownloadUrl(key: string, fileName?: string): Promise<string> {
    return this.s3Service.getSignedUrl(key, 3600);
  }

  validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      return { valid: false, error: `File type ${file.mimetype} is not allowed` };
    }

    if (file.size > this.maxFileSize) {
      return { valid: false, error: `File size exceeds ${this.maxFileSize / (1024 * 1024)}MB limit` };
    }

    return { valid: true };
  }
}
