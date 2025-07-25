import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { StealthContext } from '@common/utils/browser/stealthContext';
import { Platform } from '@common/types/platform-types.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { test as base, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';

const platform: Platform = 'MOBILE_WEB';

class BaseMobileWebFixture extends BasePocFixture {
  /**
   * POC 테스트 시작 전 조건 설정
   */
  public async setupForPoc(poc: string): Promise<string> {
    if (poc === 'all') return urlLocator.main[platform];
    await this.prepare(poc);
    const baseURL = process.env.BASE_URL || urlLocator.main[platform];
    return baseURL;
  }

  /**
   * POC 테스트 종료 후 조건 삭제
   */
  public async teardownForPoc(poc: string): Promise<void> {
    if (poc === 'all') return;
  }

  /**
   * 실행 환경별 커스텀 준비 (하위 클래스에서 오버라이딩)
   */
  protected async prepare(poc: string): Promise<void> {
    // 기본 동작 없음 (필요 시 override)
  }

  /**
   * Playwright 테스트 fixture 확장
   */
  public getTestExtend() {
    return base.extend<{
      poc: string;
      baseURL: string;
    }>({
      poc: [(process.env.POC as string) || '', { option: true }],

      baseURL: async ({ poc }, use) => {
        const baseURL = await this.setupForPoc(poc);
        await use(baseURL);
        await this.teardownForPoc(poc);
      },
    });
  }
}

export async function createStealthPage(): Promise<{ page: Page; context: BrowserContext }> {
  const stealth = new StealthContext({ platform: platform });
  const browser = await stealth.launchBrowser();
  const context = await stealth.createContext(browser);
  const page = await context.newPage();
  return { page, context };
}

export const mobileWebFixture = new BaseMobileWebFixture();
export const test = mobileWebFixture.getTestExtend();
export { expect };
