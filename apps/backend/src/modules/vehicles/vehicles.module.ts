import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { VehicleRepository } from '../../database/repositories/vehicle.repository';
import { StorageModule } from '../../integrations/storage/storage.module';
import { MapsModule } from '../../integrations/maps/maps.module';
import { PrismaService } from '../../database/prisma/prisma.service';

@Module({
  imports: [StorageModule, MapsModule],
  controllers: [VehiclesController],
  providers: [VehiclesService, VehicleRepository, PrismaService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
