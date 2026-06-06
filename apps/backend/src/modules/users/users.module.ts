import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from '../../database/repositories/user.repository';
import { SavedVehicleRepository } from '../../database/repositories/saved-vehicle.repository';
import { UserPreferenceRepository } from '../../database/repositories/user-preference.repository';
import { S3Service } from '../../integrations/storage/s3.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, SavedVehicleRepository, UserPreferenceRepository, S3Service],
  exports: [UsersService],
})
export class UsersModule {}
