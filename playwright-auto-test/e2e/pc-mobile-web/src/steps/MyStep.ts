import { BaseActions } from '@common/actions/BaseActions.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { MyPage } from '@e2e/pc-mobile-web/src/pages/MyPage.js';
import type { Page } from '@playwright/test';

export class MySteps extends BaseActions {
  private myPage: MyPage;
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super();
    this.myPage = new MyPage(page);
  }

  async myTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.myPage.testStartAndMovePage(this.platform, urlLocator.mypage[this.platform], uiLocator.mypageMenu[this.uiType], uiLocator.subMainBtn[this.uiType]),
        () => this.myPage.claimAndPaymentSectionCheck(),
        () => this.myPage.moreBillCheck(),
      ],
    );
  }

  async myBillTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.myPage.testStartAndMovePage(this.platform, urlLocator.payinfo[this.platform], uiLocator.mypageMenu[this.uiType], uiLocator.mypageBill[this.uiType]),
        () => this.myPage.moreBillCheck(),
        () => this.myPage.claimSectionCheck(),
        () => this.myPage.paymentSectionCheck(),
      ],
    );
  }

  async myUseTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.myPage.testStartAndMovePage(this.platform, urlLocator.bilv[this.platform], uiLocator.mypageMenu[this.uiType], uiLocator.mypageUse[this.uiType]),
        () => this.myPage.tabTextCheck(),
        () => this.myPage.chargeSectionCheck(),
        () => this.myPage.monthlyUsageCheck(),
        () => this.myPage.callDetailsCheck(),
      ],
    );
  }
}
