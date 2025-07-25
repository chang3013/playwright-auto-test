import { AppActions } from '@common/actions/AppActions.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { ujamLocator } from '@common/locators/ujamLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Browser } from 'webdriverio';

export class UjamPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }
  /**
   * 유잼 이동 및 정상이동 확인
   */
  async goToUjam(): Promise<boolean> {
    try {
      //케이스 시작 전 홈이동 및 안정화 대기
      await this.goToHome();
      await this.driver.pause(1000);

      //케이스 시작
      await this.waitAndClick(uiLocator.hamburger[this.uiType]);
      await this.waitAndClick(ujamLocator.benefitBtn[this.uiType]);
      await this.waitAndClick(ujamLocator.servicePlus);
      await this.waitAndClick(ujamLocator.ujamMenu);
      return await this.isCurrentUrlIncludes(ujamLocator.ujamUrl[this.uiType]);
    } catch (err) {
      console.log(err, '유잼 이동 확인 실패');
      return false;
    }
  }
}
