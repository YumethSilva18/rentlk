import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException(`${metadata.data || 'id'} must be a valid MongoDB ObjectId`);
    }
    if (!/^[a-f\d]{24}$/i.test(value)) {
      throw new BadRequestException(`${metadata.data || 'id'} must be a valid MongoDB ObjectId`);
    }
    return value;
  }
}
