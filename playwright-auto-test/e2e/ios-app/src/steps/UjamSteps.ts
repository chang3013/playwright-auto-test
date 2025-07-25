import { UjamPage } from '@e2e/ios-app/src/pages/UjamPage.js';
import type { Browser } from 'webdriverio';

export class UjamSteps {
  private readonly ujamPage: UjamPage;

  constructor(driver: Browser) {
    this.ujamPage = new UjamPage(driver);
  }

  // /**
  //  * 마이 페이지
  //  */
  // async ujamCase(): Promise<void> {
  //   const success = await this.ujamPage.ujamCase();
  //   if (!success) {
  //     throw new Error('메인 페이지 확인 실패');
  //   }
  // }
  /**
   * 유잼 케이스 스탭
   */
  async ujamCase(): Promise<boolean> {
    try {
      return await this.ujamPage.goToUjam();
    } catch (err) {
      console.log(err, '유잼케이스 확인 실패');
      return false;
    }
  }
}
