import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { Public } from '../../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async initiatePayment(
    @CurrentUser('id') userId: string,
    @Body() data: { bookingId: string; method: string; idempotencyKey?: string },
  ) {
    return this.paymentsService.initiatePayment(userId, data.bookingId, data.method, data.idempotencyKey);
  }

  @Get('my/history')
  async getUserPayments(
    @CurrentUser('id') userId: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.paymentsService.getUserPayments(userId, { skip, take });
  }

  @Get('booking/:bookingId')
  async getBookingPayments(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getBookingPayments(bookingId);
  }

  @Get(':id')
  async getPayment(@Param('id') id: string) {
    return this.paymentsService.getPayment(id);
  }

  @Post(':id/confirm')
  async confirmPayment(@Param('id') id: string, @Body() data: { gatewayRef: string; gatewayResponse?: any }) {
    return this.paymentsService.confirmPayment(id, data.gatewayRef, data.gatewayResponse);
  }

  @Post(':id/refund')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async refundPayment(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body() data: { amount?: number; reason?: string },
  ) {
    return this.paymentsService.refundPayment(id, adminId, data.amount, data.reason);
  }

  @Post(':id/retry')
  async retryPayment(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.paymentsService.retryPayment(id, userId);
  }

  // Webhook endpoints (public - called by payment gateways)
  @Public()
  @Post('webhook/payhere')
  @HttpCode(HttpStatus.OK)
  async payhereWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook('payhere', payload);
  }

  @Public()
  @Post('webhook/stripe')
  @HttpCode(HttpStatus.OK)
  async stripeWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook('stripe', payload);
  }

  @Public()
  @Post('webhook/ezcash')
  @HttpCode(HttpStatus.OK)
  async ezcashWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook('ezcash', payload);
  }
}
