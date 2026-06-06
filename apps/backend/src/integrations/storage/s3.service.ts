import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('aws.s3.bucket');
    this.region = this.configService.get<string>('aws.region');
  }

  async uploadFile(
    key: string,
    body: Buffer,
    contentType: string,
    acl: string = 'public-read',
  ): Promise<string> {
    this.logger.log(`Uploading file to S3: ${key}`);

    const mockUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    this.logger.log(`File uploaded: ${mockUrl}`);
    return mockUrl;
  }

  async uploadMultiple(
    files: Array<{ key: string; body: Buffer; contentType: string }>,
  ): Promise<string[]> {
    const urls = await Promise.all(
      files.map((file) => this.uploadFile(file.key, file.body, file.contentType)),
    );
    return urls;
  }

  async deleteFile(key: string): Promise<void> {
    this.logger.log(`Deleting file from S3: ${key}`);
  }

  async deleteMultiple(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.deleteFile(key)));
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    this.logger.log(`Generating signed URL for ${key}`);
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}?signature=mock&expires=${expiresIn}`;
  }

  generateKey(prefix: string, fileName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const ext = fileName.split('.').pop();
    return `${prefix}/${timestamp}-${random}.${ext}`;
  }

  async fileExists(key: string): Promise<boolean> {
    this.logger.log(`Checking if file exists: ${key}`);
    return true;
  }
}
