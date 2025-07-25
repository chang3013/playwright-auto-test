import { MobilePlanPage } from '@e2e/ios-app/src/pages/MobilePlanPage.js';
import type { Browser } from 'webdriverio';

export class MobilePlanSteps {
  private readonly mobilePlanPage: MobilePlanPage;

  constructor(driver: Browser) {
    this.mobilePlanPage = new MobilePlanPage(driver);
  }

  /**
   * 마이 페이지
   */
  async mobilePlanCase(): Promise<void> {
    const success = await this.mobilePlanPage.mobilePlanCase();
    if (!success) {
      throw new Error('메인 페이지 확인 실패');
    }
  }
}
