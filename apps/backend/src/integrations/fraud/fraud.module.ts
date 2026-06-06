import { Module } from '@nestjs/common';
import { FraudScoreService } from './fraud-score.service';
import { AnomalyDetectorService } from './anomaly-detector.service';
import { RulesEngineService } from './rules-engine.service';

@Module({
  providers: [FraudScoreService, AnomalyDetectorService, RulesEngineService],
  exports: [FraudScoreService, AnomalyDetectorService, RulesEngineService],
})
export class FraudModule {}
