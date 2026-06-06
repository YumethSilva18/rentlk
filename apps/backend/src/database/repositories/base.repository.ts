import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BaseRepository {
  constructor(protected readonly prisma: PrismaService) {}

  protected get client() {
    return this.prisma;
  }

  protected async exists(model: string, field: string, value: any): Promise<boolean> {
    const count = await (this.prisma as any)[model].count({
      where: { [field]: value },
    });
    return count > 0;
  }
}
