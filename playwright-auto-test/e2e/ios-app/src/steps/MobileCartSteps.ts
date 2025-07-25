import { MobileCartPage } from '@e2e/ios-app/src/pages/MobileCartPage.js';
import type { Browser } from 'webdriverio';

export class MobileCartSteps {
  private readonly mobileCartPage: MobileCartPage;

  constructor(driver: Browser) {
    this.mobileCartPage = new MobileCartPage(driver);
  }

  /**
   * 마이 페이지
   */
  async mobileCartCase(): Promise<void> {
    const success = await this.mobileCartPage.mobileCartCase();
    if (!success) {
      throw new Error('메인 페이지 확인 실패');
    }
  }
}
