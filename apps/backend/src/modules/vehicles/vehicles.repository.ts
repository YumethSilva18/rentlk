import { Injectable } from '@nestjs/common';
import { VehicleRepository as DbVehicleRepository } from '../../../database/repositories/vehicle.repository';

@Injectable()
export class VehiclesRepository extends DbVehicleRepository {}
