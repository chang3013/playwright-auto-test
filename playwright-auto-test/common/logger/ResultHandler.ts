/**
 * Description : ResultHandler.ts - 테스트 결과 저장 및 오류 처리 클래스
 */
import { TEST_RESULT_FILE_NAME } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import type { POCType } from '@common/types/platform-types.js';
import { POCEnv } from '@common/utils/env/POCEnv';
import * as fs from 'fs/promises';
import * as path from 'path';
import { type BrowserContext, chromium, type Page } from 'playwright';
import type winston from 'winston';

export class ResultHandler {
  private readonly poc: string;
  private readonly logger: winston.Logger;

  constructor(poc?: string) {
    this.poc = poc ?? POCEnv.getType();
    this.logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
  }
  /**
   * 테스트 결과 저장 메서드
   */
  public async saveTestResult(
    status: 'PASS' | 'FAIL',
    details?: string,
    page?: Page,
  ): Promise<void> {
    try {
      if (status === 'FAIL' && page) {
        await this.errorHandler(new Error(details || 'Test failed'), '테스트 실패');
      }
    } catch (err) {
      this.logger.error(`테스트 결과 저장 중 오류 발생 (POC: ${this.poc}):`, err);
    }
  }

  /**
   * 오류 처리 및 관련 리소스 저장 (스크린샷, 트레이스, 비디오)
   */
  private async errorHandler(error: Error, message: string): Promise<void> {
    this.logger.error(`${message}: ${error.message}`);
    this.logger.error(error.stack);

    const knownErrors: Record<string, string> = {
      TimeoutError: '타임아웃이 발생했습니다.',
      NoSuchElementError: '요소를 찾을 수 없습니다.',
      ElementNotVisibleError: '요소가 보이지 않습니다.',
      ElementNotInteractableError: '해당 요소와 상호작용할 수 없습니다.',
      SelectorError: '잘못된 선택자가 사용되었습니다.',
      NavigationError: '페이지 네비게이션 중 오류가 발생했습니다.',
      AssertionError: '테스트 검증에 실패하였습니다. (Assertion Error)',
      PageError: '페이지에서 오류가 발생했습니다.',
    };

    this.logger.warn(knownErrors[error.name] || `예상치 못한 예외 발생: ${error.name}`);

    const results = TEST_RESULT_FILE_NAME(this.poc as POCType);

    const browser = await chromium.launch();
    const context = await browser.newContext({
      recordVideo: {
        dir: './tmp-videos', // 임시 저장 경로
        size: { width: 1280, height: 720 },
      },
    });
    await context.tracing.start({ screenshots: true, snapshots: true });
    const newPage = await context.newPage();

    try {
      for (const screenshotPath of results.screenshots) {
        await this.screenshotOnError(newPage, screenshotPath);
      }

      for (const tracePath of results.traces) {
        await this.saveTestTrace(context, tracePath);
      }

      for (const videoPath of results.videos) {
        await this.saveTestVideo(newPage, videoPath);
      }
    } finally {
      await context.close();
      await browser.close();
    }
  }

  /**
   * 오류 발생 시 스크린샷 저장
   */
  private async screenshotOnError(page: Page, filePath: string) {
    try {
      await page.screenshot({ path: filePath, fullPage: true });
      this.logger.info(`스크린샷 저장됨: ${filePath}`);
    } catch (err) {
      this.logger.error('스크린샷 캡처 중 오류 발생:', err);
    }
  }

  /**
   * 오류 발생 시 트레이스 저장
   */
  private async saveTestTrace(context: BrowserContext, filePath: string) {
    try {
      // tracing.start()가 호출되지 않으면 저장되지 않음
      await context.tracing.stop({ path: filePath });
      this.logger.info(`트레이스 파일 저장됨: ${filePath}`);
    } catch (err) {
      this.logger.error('트레이스 저장 중 오류 발생:', err);
    }
  }

  /**
   * 오류 발생 시 비디오 저장
   *
   * (context 생성 시, recordVideo 옵션 추가해야 정상 동작함)
   */
  private async saveTestVideo(page: Page, targetPath: string) {
    try {
      const video = page.video();
      if (!video) {
        this.logger.warn('비디오 객체를 찾을 수 없습니다. 저장되지 않았을 수 있습니다.');
        return;
      }

      const videoPath = await video.path();
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.copyFile(videoPath, targetPath);
      this.logger.info(`비디오 파일 저장됨: ${targetPath}`);
    } catch (err) {
      this.logger.error('비디오 저장 중 오류 발생:', err);
    }
  }
}
