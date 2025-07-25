import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
// import { CDPConnectUtils } from '@common/utils/context/CDPConnectUtils';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

export class ContextUtils {
  private static readonly poc: string = POCEnv.getType();

  private static readonly logger: winston.Logger = Logger.getLogger(
    this.poc.toUpperCase(),
  ) as winston.Logger;

  private static readonly MAX_RETRIES = 3;

  /**
   * 드라이버의 모든 컨텍스트 목록을 문자열 배열로 반환
   */
  public static async getAllContextNames(driver: Browser): Promise<string[]> {
    const contexts = await driver.getContexts();

    return contexts
      .map(ctx => (typeof ctx === 'string' ? ctx : ctx.id))
      .filter(Boolean) as string[];
  }
  
  /**
   * 현재 컨텍스트 문자열 반환 및 로그 출력
   */
  public static async getCurrentContext(driver: Browser): Promise<string> {
    const currentContext = await driver.getContext();
    this.logger.info(`[ContextUtils][${this.poc}] 현재 콘템스트: ${currentContext}`);
    return currentContext as string;
  }

  /**
   * 현재 컨텍스트가 WEBVIEW인지 확인
   */
  public static async isInWebviewContext(driver: Browser): Promise<boolean> {
    const currentContext = await driver.getContext();
    const isWebview = typeof currentContext === 'string' && currentContext.includes('WEBVIEW');

    this.logger.info(
      `[ContextUtils][${this.poc}] 현재 컨텍스트: ${currentContext} (WEBVIEW 여부: ${isWebview})`,
    );

    return isWebview;
  }

  /**
   * 현재 컨텍스트가 NATIVE_APP인지 확인
   */
  public static async isInNativeContext(driver: Browser): Promise<boolean> {
    const currentContext = await driver.getContext();
    const isNative = typeof currentContext === 'string' && currentContext.includes('NATIVE_APP');

    this.logger.info(
      `[ContextUtils][${this.poc}] 현재 컨텍스트: ${currentContext} (NATIVE_APP 여부: ${isNative})`,
    );

    return isNative;
  }

  /**
   * WEBVIEW 컨텍스트가 존재하면 해당 컨텍스트로 전환
   */
  public static async switchToWebviewContext(driver: Browser): Promise<boolean> {
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
    const webview = stringContexts.find(ctx => ctx.includes('WEBVIEW'));

    if (webview) {
      await driver.switchContext(webview);
      this.logger.info(`[ContextUtils][${this.poc}] WEBVIEW 컨텍스트 전환 성공: ${webview}`);
      return true;
    }

    this.logger.warn(
      `[ContextUtils][${this.poc}] WEBVIEW 컨텍스트가 존재하지 않습니다. 전체 목록: ${JSON.stringify(stringContexts)}`,
    );

    return false;
  }

  /** / CDP 포워딩 주소를 생성 성공하였으나, Playwright와의 호환성 문제로 인해 사용하지 않음 */
  // /**
  //  * Chrome WEBVIEW 컨텍스트 전환 + CDP 연결용 포워딩 주소 반환
  //  */
  // public static async switchToWebViewCDP(
  //   driver: Browser,
  //   udid: string
  // ): Promise<{ success: boolean; wsEndpoint?: string }> {
  //   const contexts = await driver.getContexts();
  //   const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id ?? ''));
  //   const targetContext = stringContexts.find(ctx => ctx.includes('WEBVIEW_com.lguplus.mobile.cs'));
  //   if (!targetContext) {
  //     this.logger.warn(`[ContextUtils][${this.poc}] WEBVIEW 컨텍스트가 없습니다: ${stringContexts}`);
  //     return { success: false };
  //   }
  //   await driver.switchContext(targetContext);
  //   this.logger.info(`[ContextUtils][${this.poc}] Switched to WEBVIEW: ${targetContext}`);
  //   try {
  //     const { wsEndpoint } = await CDPConnectUtils.getWebViewCDPEndpoint(udid);
  //     this.logger.info(`[ContextUtils][${this.poc}] CDP 포워딩 주소 획득: ${wsEndpoint}`);
  //     return { success: true, wsEndpoint };
  //   } catch (e) {
  //     this.logger.warn(`[ContextUtils][${this.poc}] 포워딩 주소 생성 실패: ${e}`);
  //     return { success: true, wsEndpoint: undefined };
  //   }
  // }
  // /**
  //  * iOS: 기본 WebView 컨텍스트 반환
  //  */
  // public static async getDefaultIOSWebviewContext(driver: Browser): Promise<string | null> {
  //   const contexts = await driver.getContexts();
  //   const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
  //   if (stringContexts.length === 2) {
  //     const webview = stringContexts[1];
  //     this.logger.info(`[ContextUtils][${this.poc}] default webview context: ${webview}`);
  //     return webview;
  //   }
  //   this.logger.warn(`[ContextUtils][${this.poc}] WEBVIEW 컨텍스트를 찾을 수 없습니다.`);
  //   return null;
  // }
  // /**
  //  * iOS: WebKit 포트 포워딩 명령 생성
  //  */
  // public static async forwardIOSWebKitPort(udid: string): Promise<number> {
  //   const port = Math.floor(Math.random() * (65535 - 1024) + 1024);
  //   const cmd = `ios_webkit_debug_proxy -c ${udid}:${port} &`;
  //   this.logger.info(`[ContextUtils][${this.poc}] WebKit 디버깅 포트 연결 명령: ${cmd}`);
  //   return port;
  // }
  /** CDP 포워딩 주소를 생성 성공하였으나, Playwright와의 호환성 문제로 인해 사용하지 않음/ */
  /**
   * WEBVIEW 컨텍스트가 나타날 때까지 일정 시간 대기
   */
  public static async waitForWebviewContext(driver: Browser, maxRetry = 5): Promise<string | null> {
    for (let i = 0; i < maxRetry; i++) {
      const contexts = await this.getAllContextNames(driver);
      const webview = contexts.find(ctx => ctx.includes('WEBVIEW'));
      if (webview) return webview;
      await driver.pause(1000);
    }
    this.logger.warn(`[ContextUtils][${this.poc}] WEBVIEW 콘템스트 대기 시간 초과`);
    return null;
  }

  /**
   * WEBVIEW가 나타날 때까지 기다렸다가 전환 시도
   */
  public static async forceSwitchToWebviewContext(driver: Browser, retry = 5): Promise<boolean> {
    const webview = await this.waitForWebviewContext(driver, retry);
    if (webview) {
      await driver.switchContext(webview);
      this.logger.info(`[ContextUtils][${this.poc}] WEBVIEW 강제 전환 성공: ${webview}`);
      return true;
    }
    this.logger.warn(`[ContextUtils][${this.poc}] WEBVIEW 전환 실패`);
    return false;
  }

  /**
   * NATIVE_APP 컨텍스트로 전환
   */
  public static async switchToNativeContext(driver: Browser): Promise<void> {
    const contexts = await driver.getContexts();
    const stringContexts = contexts.map(ctx => (typeof ctx === 'string' ? ctx : ctx.id));
    const native = stringContexts.find(ctx => ctx.includes('NATIVE_APP'));

    if (native) {
      await driver.switchContext(native);
      this.logger.info(`[ContextUtils][${this.poc}] Switched to NATIVE_APP: ${native}`);
    } else {
      this.logger.warn(`[ContextUtils][${this.poc}] NATIVE_APP 컨텍스트가 존재하지 않습니다.`);
    }
  }

  /**
   * 전체 컨텍스트 목록을 로그로 출력
   */
  public static async logContextList(driver: Browser): Promise<void> {
    const contexts = await this.getAllContextNames(driver);
    this.logger.info(`[ContextUtils][${this.poc}] 전체 콘템스트 목록: ${JSON.stringify(contexts)}`);
  }

  /**
   * 인덱스로 지정된 위치의 컨텍스트로 전환
   */
  public static async switchToContextByIndex(driver: Browser, index: number): Promise<void> {
    const contexts = await this.getAllContextNames(driver);
    if (index < 0 || index >= contexts.length) {
      throw new Error(`[ContextUtils][${this.poc}] 유효하지 않은 인덱스: ${index}`);
    }
    await driver.switchContext(contexts[index]);
    this.logger.info(`[ContextUtils][${this.poc}] 인덱스로 컨텍스트 전환: ${contexts[index]}`);
  }

  /**
   * 전체 컨텍스트 개수 반환
   */
  public static async getContextCount(driver: Browser): Promise<number> {
    const contexts = await this.getAllContextNames(driver);
    return contexts.length;
  }

  /**
   * 특정 키워드가 포함된 컨텍스트 목록만 필터링
   */
  public static async getContextsMatching(driver: Browser, keyword: string): Promise<string[]> {
    const contexts = await this.getAllContextNames(driver);
    return contexts.filter(ctx => ctx.includes(keyword));
  }

  /**
   * 컨텍스트가 변경될 때까지 대기 (이전과 다를 경우 반환)
   */

  public static async waitForContextChange(
    driver: Browser,
    prevContext: string,
    maxRetry = 5,
  ): Promise<string | null> {
    for (let i = 0; i < maxRetry; i++) {
      const current = await driver.getContext();
      if (current !== prevContext) return current as string;
      await driver.pause(1000);
    }
    this.logger.warn(`[ContextUtils][${this.poc}] 컨텍스트 변경 대기 시간 초과`);
    return null;
  }
}
