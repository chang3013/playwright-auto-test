import { AppActions } from '@common/actions/AppActions.js';
import { udocLocator } from '@common/locators/udocLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Browser } from 'webdriverio';

export class UdocPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }
  async goToUdoc(): Promise<boolean> {
    try {
      //케이스 시작 전 홈이동 및 안정화 대기
      await this.goToHome();
      await this.driver.pause(1000);

      //케이스 시작
      await this.waitAndClick(uiLocator.hamburger[this.uiType]);
      await this.waitAndClick(udocLocator.udocMenu[this.uiType]);
      await this.driver.pause(1000);

      return this.isCurrentUrlIncludes(udocLocator.udocUrl[this.uiType]);
    } catch (err) {
      return false;
    }
  }
}
