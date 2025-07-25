import { UdocPage } from '@e2e/ios-app/src/pages/UdocPage.js';
import type { Browser } from 'webdriverio';

export class UdocSteps {
  private readonly udocPage: UdocPage;

  constructor(driver: Browser) {
    this.udocPage = new UdocPage(driver);
  }

  /**
   * 유독 케이스 스탭
   */
  async udocCase(): Promise<boolean> {
    try {
      return await this.udocPage.goToUdoc();
    } catch (err) {
      console.log(err, '유독 이동 확인 실패');
      return false;
    }
  }
}
