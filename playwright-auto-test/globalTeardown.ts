import { PocInitializer } from '@common/initializers/PocInitializer.js';
import { Logger } from '@common/logger/customLogger.js';
import { ResultHandler } from '@common/logger/ResultHandler.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import { AppiumServerUtils as AOSAppiumServerUtils } from '@e2e/aos-appium-server/AppiumServerUtils.js';
import { AppiumServerUtils as IOSAppiumServerUtils } from '@e2e/ios-appium-server/AppiumServerUtils.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import type winston from 'winston';

dotenv.config();

const LOCK_FILE_PATH = path.resolve('test-results/.teardown.lock');

class GlobalTeardown {
  private readonly poc: string;
  private readonly logger: winston.Logger;
  private readonly resultHandler: ResultHandler;

  constructor() {
    this.poc = POCEnv.getType();
    this.logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
    this.resultHandler = new ResultHandler(this.poc);
  }

  public async run(): Promise<void> {
    this.logger.info(`[GLOBAL TEARDOWN] 시작 - 대상 POC: ${this.poc}`, {
      poc: this.poc.toUpperCase(),
    });

    try {
      const initializer = new PocInitializer(this.poc);
      await initializer.teardown();

      // ✅ Appium teardown은 poc가 ios 또는 aos일 때만
      const pocLower = this.poc.toLowerCase();
      if (pocLower === 'ios' || pocLower === 'aos') {
        const port = pocLower === 'ios' ? 4723 : 4725;
        const AppiumUtils = pocLower === 'ios' ? IOSAppiumServerUtils : AOSAppiumServerUtils;
        await AppiumUtils.stop(port);
      }

      // ✅ PC/MW는 POC=all 조건 하에서 lock 파일 기반으로 한 번만 teardown
      if ((pocLower === 'pc' || pocLower === 'mw') && process.env.POC?.toLowerCase() === 'all') {
        if (fs.existsSync(LOCK_FILE_PATH)) {
          this.logger.info(`[GLOBAL TEARDOWN] 공통 리소스는 이미 정리됨 (LOCK 존재)`, {
            poc: this.poc.toUpperCase(),
          });
        } else {
          fs.writeFileSync(LOCK_FILE_PATH, `${this.poc} cleaned`);
          this.logger.info(`[GLOBAL TEARDOWN] 공통 리소스 정리 수행 (LOCK 생성됨)`, {
            poc: this.poc.toUpperCase(),
          });

          // 🔽 여기에 PC/MW 공통 리소스 정리 로직 작성
          // e.g. 서버 종료, DB 닫기, 임시파일 삭제 등
        }
      }

      this.logger.info(`[GLOBAL TEARDOWN] 전체 테스트 환경 정리 완료`, {
        poc: this.poc.toUpperCase(),
      });
      await this.resultHandler.saveTestResult('PASS', '[GLOBAL TEARDOWN] 테스트 정상 종료');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`[GLOBAL TEARDOWN] 실패: ${errorMessage}`, {
        poc: this.poc.toUpperCase(),
      });
      await this.resultHandler.saveTestResult('FAIL', `[GLOBAL TEARDOWN] 오류: ${errorMessage}`);
      throw err;
    }
  }
}

export default async function globalTeardown(): Promise<void> {
  const handler = new GlobalTeardown();
  await handler.run();
}
