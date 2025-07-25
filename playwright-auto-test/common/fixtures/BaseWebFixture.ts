import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { StealthContext } from '@common/utils/browser/stealthContext';
import { Platform } from '@common/types/platform-types.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { test as base, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';
import { spawn } from 'child_process';

const platform: Platform = 'PC_WEB';

class BaseWebFixture extends BasePocFixture {
  /**
   * 테스트 환경 구성
   */
  public async setupForPoc(poc: string): Promise<string> {
    await this.prepare(poc);
    const baseURL = process.env.BASE_URL || urlLocator.main[platform];
    return baseURL;
  }

  /**
   * 테스트 종료 후 정리
   */
  public async teardownForPoc(poc: string): Promise<void> {
  }

  /**
   * 실행 환경별 커스텀 준비 (하위 클래스에서 오버라이딩)
   */
  protected async prepare(poc: string): Promise<void> {
    // 기본 동작 없음 (필요 시 override)
  }

  /**
   * 전체 POC 병렬 실행
   */
  public async runAllPOCsInParallel(): Promise<void> {
    this.logger.info('[WebFixture] POC=ALL -> 전체 병렬 실행 시작');

    const processes = this.pocList.map(poc => {
      return new Promise<void>((resolve, reject) => {
        const child = spawn('npx', ['playwright', 'test', `--project=${poc}`], {
          stdio: 'inherit',
          env: { ...process.env, POC: poc },
          shell: true,
        });

        child.on('close', code => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`[${poc}] 테스트 실패 (exit code: ${code})`));
          }
        });
      });
    });

    await Promise.all(processes);
    this.logger.info('[WebFixture] 전체 POC 병렬 실행 완료');
  }

  /**
   * test.extend 정의
   */
  public getTestExtend() {
    return base.extend<{
      poc: string;
      baseURL: string;
    }>({
      poc: [(process.env.POC as string) || '', { option: true }],

      baseURL: async ({ poc }, use) => {
        const logger = this.getLogger(poc);
        const baseURL = await this.setupForPoc(poc);
        await use(baseURL);
        await this.teardownForPoc(poc);
      },
    });
  }
}

export async function createStealthPage(): Promise<{ page: Page; context: BrowserContext }> {
  const stealth = new StealthContext();
  const browser = await stealth.launchBrowser();
  const context = await stealth.createContext(browser);
  const page = await context.newPage();
  return { page, context };
}

export const webFixture = new BaseWebFixture();
export const test = webFixture.getTestExtend();
export { expect };
