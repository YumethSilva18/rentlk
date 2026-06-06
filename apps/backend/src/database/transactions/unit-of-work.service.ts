import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitOfWorkService {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(
    fn: (tx: PrismaService) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (prisma) => {
      return fn(prisma as unknown as PrismaService);
    });
  }

  async executeWithIsolation<T>(
    fn: (tx: PrismaService) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(
      async (prisma) => {
        return fn(prisma as unknown as PrismaService);
      },
      {
        isolationLevel: 'Serializable',
      },
    );
  }
}
