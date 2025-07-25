import { Logger } from '@common/logger/customLogger';
import { ContextUtils } from '@common/utils/context/contextUtils';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class AndroidTestEnv {
  private readonly pocList: string[];
  private readonly logger: winston.Logger;

  constructor() {
    const isAll = POCEnv.isAll();
    this.pocList = isAll ? POCEnv.getPOCList() : [POCEnv.getType()];
    const loggerKey = isAll ? 'ALL' : POCEnv.getType().toUpperCase();
    this.logger = Logger.getLogger(loggerKey) as winston.Logger;
  }

  /**
   * Android 앱 테스트 환경 초기화
   */
  public async setup(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] Android 테스트 환경 준비 시작`);

      try {
        const driver = (global as any).driver as Browser;
        if (!driver) {
          this.logger.warn(`[${poc}] 드라이버가 전역에 존재하지 않습니다.`);
          continue;
        }

        // 앱 수동 실행 (포그라운드 전환)
        const appPackage =
          driver.capabilities['appium:appPackage'] || (driver.capabilities as any).appPackage;
        if (appPackage) {
          await driver.activateApp(appPackage);
          await driver.pause(3000);
          this.logger.info(`[${poc}] 앱 실행 완료: ${appPackage}`);
        } else {
          this.logger.warn(`[${poc}] appPackage 정보 없음 → 앱 실행 생략`);
        }

        await this.logContextState(driver, poc);

        // WebView 컨텍스트 전환 시도
        const udid =
          (driver.capabilities as any)['appium:udid'] || (driver.capabilities as any)['udid'] || '';
        if (udid) {
          await this.switchToWebViewContext(poc, driver);
        } else {
          this.logger.warn(`[${poc}] UDID 없음 → WebView 연결 생략`);
        }

        this.logger.info(`[${poc}] Android 테스트 환경 준비 완료`);
      } catch (error) {
        this.logger.error(`[${poc}] Android 테스트 환경 준비 실패: ${error}`);
        throw error;
      }
    }
  }

  /**
   * WebView 컨텍스트 전환
   */
  private async switchToWebViewContext(poc: string, driver: Browser): Promise<void> {
    try {
      const contexts = await driver.getContexts();
      const webviewCtx = contexts.find((ctx: any) =>
        typeof ctx === 'string' ? ctx.includes('WEBVIEW') : ctx.id?.includes('WEBVIEW'),
      );

      if (webviewCtx) {
        await driver.switchContext(webviewCtx);
        this.logger.info(`[${poc}] WebView 컨텍스트 전환 완료: ${webviewCtx}`);
        const title = await driver.getTitle();
        this.logger.info(`[${poc}] WebView 페이지 타이틀: ${title}`);
      } else {
        this.logger.warn(`[${poc}] WebView 컨텍스트 없음`);
      }
    } catch (e) {
      this.logger.warn(`[${poc}] WebView 전환 중 예외 발생: ${e instanceof Error ? e.message : e}`);
      throw e;
    }
  }

  /**
   * 현재 컨텍스트(WebView or Native) 상태 확인 및 로깅
   */
  private async logContextState(driver: Browser, poc: string): Promise<void> {
    if (await ContextUtils.isInWebviewContext(driver)) {
      this.logger.info(`[${poc}] 현재 WebView 컨텍스트`);
    } else if (await ContextUtils.isInNativeContext(driver)) {
      this.logger.info(`[${poc}] 현재 Native 컨텍스트`);
    } else {
      this.logger.warn(`[${poc}] 알 수 없는 컨텍스트 상태`);
    }
  }

  /**
   * Android 앱 테스트 환경 정리
   */
  public async teardown(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] Android 테스트 환경 정리 시작`);
      // 드라이버는 전역 fixture에서 관리되므로 여기서는 별도 정리 생략
      this.logger.info(`[${poc}] Android 테스트 환경 정리 완료`);
    }
  }
}
