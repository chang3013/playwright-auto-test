import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import type winston from 'winston';

export class IosTestEnv {
  private readonly pocList = POCEnv.getPOCList();
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = Logger.getLogger(POCEnv.getType().toUpperCase()) as winston.Logger;
  }

  /**
   * iOS 테스트 환경 초기화 (더 이상 아무것도 안 함)
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] iOS 테스트 환경 설정 준비 완료 (별도 작업 없음)`);
    }
  }

  /**
   * iOS 테스트 환경 정리 (더 이상 아무것도 안 함)
   */
  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] iOS 테스트 환경 정리 완료 (별도 작업 없음)`);
    }
  }
}
