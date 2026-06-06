import { Injectable } from '@nestjs/common';
import { PaymentRepository as DbPaymentRepository } from '../../../database/repositories/payment.repository';

@Injectable()
export class PaymentsRepository extends DbPaymentRepository {}
