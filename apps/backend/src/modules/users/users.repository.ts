import { Injectable } from '@nestjs/common';
import { UserRepository as DbUserRepository } from '../../../database/repositories/user.repository';

@Injectable()
export class UsersRepository extends DbUserRepository {}
