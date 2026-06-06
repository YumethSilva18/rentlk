import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KycRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.kYCDocument.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.kYCDocument.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.KYCDocumentCreateInput) {
    return this.prisma.kYCDocument.create({ data });
  }

  async update(id: string, data: Prisma.KYCDocumentUpdateInput) {
    return this.prisma.kYCDocument.update({ where: { id }, data });
  }

  async getPendingDocuments() {
    return this.prisma.kYCDocument.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, firstName: true, lastName: true, phoneNumber: true } } },
    });
  }

  async approveDocument(id: string, verifiedBy: string) {
    return this.prisma.kYCDocument.update({
      where: { id },
      data: {
        status: 'APPROVED',
        verifiedAt: new Date(),
        verifiedBy,
      },
    });
  }

  async rejectDocument(id: string, verifiedBy: string, reason: string) {
    return this.prisma.kYCDocument.update({
      where: { id },
      data: {
        status: 'REJECTED',
        verifiedBy,
        rejectReason: reason,
      },
    });
  }

  async getLatestByUser(userId: string) {
    return this.prisma.kYCDocument.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(where?: Prisma.KYCDocumentWhereInput) {
    return this.prisma.kYCDocument.count({ where });
  }

  async findPendingByUserId(userId: string) {
    return this.prisma.kYCDocument.findFirst({
      where: { userId, status: 'PENDING' },
    });
  }

  async findAll(params?: { status?: string; skip?: number; take?: number }) {
    return this.prisma.kYCDocument.findMany({
      where: params?.status ? { status: params.status as any } : undefined,
      skip: params?.skip,
      take: params?.take || 50,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, firstName: true, lastName: true, phoneNumber: true } } },
    });
  }
}
