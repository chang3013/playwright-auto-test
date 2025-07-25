import { PocInitializer } from '@common/initializers/PocInitializer.js';
import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import dotenv from 'dotenv';
import type winston from 'winston';

dotenv.config();

class GlobalSetup {
  private readonly poc: string;
  private readonly logger: winston.Logger;

  constructor() {
    this.poc = POCEnv.getType();
    this.logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
  }

  public async run(): Promise<void> {
    this.logger.info(`[GLOBAL SETUP] 시작 - 대상 POC: ${this.poc || 'all'}`, {
      poc: this.poc.toUpperCase(),
    });

    try {
      const initializer = new PocInitializer(this.poc);
      await initializer.setup();

      this.logger.info(`[GLOBAL SETUP] 전체 테스트 환경 설정 완료`, {
        poc: this.poc.toUpperCase(),
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`[GLOBAL SETUP] 실패: ${errorMessage}`, { poc: this.poc.toUpperCase() });
      throw err;
    }
  }
}

export default async function globalSetup(): Promise<void> {
  const handler = new GlobalSetup();
  await handler.run();
}
