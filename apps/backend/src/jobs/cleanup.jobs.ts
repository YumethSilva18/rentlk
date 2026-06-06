import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Cron, CronExpression } from '@nestjs/schedule';

export const CLEANUP_JOBS = {
  DELETE_EXPIRED_OTPS: 'delete-expired-otps',
  CLEAR_OLD_NOTIFICATIONS: 'clear-old-notifications',
  ARCHIVE_COMPLETED_BOOKINGS: 'archive-completed-bookings',
  CLEAN_TEMP_FILES: 'clean-temp-files',
};

@Injectable()
@Processor('cleanup')
export class CleanupJobs extends WorkerHost {
  private readonly logger = new Logger(CleanupJobs.name);

  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case CLEANUP_JOBS.DELETE_EXPIRED_OTPS:
        return this.deleteExpiredOtps();
      case CLEANUP_JOBS.CLEAR_OLD_NOTIFICATIONS:
        return this.clearOldNotifications();
      case CLEANUP_JOBS.ARCHIVE_COMPLETED_BOOKINGS:
        return this.archiveCompletedBookings();
      case CLEANUP_JOBS.CLEAN_TEMP_FILES:
        return this.cleanTempFiles();
      default:
        this.logger.warn(`Unknown job: ${job.name}`);
        return null;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleDeleteExpiredOtps() {
    this.logger.log('Running scheduled: Delete expired OTPs');
    return this.deleteExpiredOtps();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleClearOldNotifications() {
    this.logger.log('Running scheduled: Clear old notifications');
    return this.clearOldNotifications();
  }

  @Cron(CronExpression.EVERY_WEEK)
  async handleArchiveCompletedBookings() {
    this.logger.log('Running scheduled: Archive completed bookings');
    return this.archiveCompletedBookings();
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCleanTempFiles() {
    this.logger.log('Running scheduled: Clean temporary files');
    return this.cleanTempFiles();
  }

  private async deleteExpiredOtps() {
    this.logger.log('Deleting expired OTP records');
    return { deleted: 0 };
  }

  private async clearOldNotifications() {
    this.logger.log('Clearing old notifications (90+ days)');
    return { cleared: 0 };
  }

  private async archiveCompletedBookings() {
    this.logger.log('Archiving completed bookings (180+ days)');
    return { archived: 0 };
  }

  private async cleanTempFiles() {
    this.logger.log('Cleaning temporary uploaded files');
    return { cleaned: 0 };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Cleanup job ${job.id} completed: ${job.name}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Cleanup job ${job.id} failed: ${error.message}`);
  }
}
