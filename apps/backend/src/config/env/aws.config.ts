import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  region: process.env.AWS_REGION || 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  s3Bucket: process.env.AWS_S3_BUCKET || 'sl-rental-uploads',
  s3Endpoint: process.env.AWS_S3_ENDPOINT || undefined,
  sesFromEmail: process.env.AWS_SES_FROM_EMAIL || 'noreply@slrental.lk',
  sesFromName: process.env.AWS_SES_FROM_NAME || 'SL Vehicle Rental',
}));
