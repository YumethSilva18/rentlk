import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileSigningService } from './file-signing.service';

@Module({
  providers: [S3Service, FileSigningService],
  exports: [S3Service, FileSigningService],
})
export class StorageModule {}
