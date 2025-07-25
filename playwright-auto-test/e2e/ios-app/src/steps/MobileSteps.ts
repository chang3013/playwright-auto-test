import { AppActions } from '@common/actions/AppActions.js';
import { MobilePage } from '@e2e/ios-app/src/pages/MobilePage.js';
import type { Browser } from 'webdriverio';

let actions: AppActions;

export class MobileSteps {
  private readonly mobilePage: MobilePage;

  constructor(driver: Browser) {
    this.mobilePage = new MobilePage(driver);
    actions = new AppActions(driver);
  }

  /**
   * 모바일 서브메인
   */
  async mobileSubCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.mobilePage.subMainKVCheck(),
      () => this.mobilePage.subMainCategoryCheck(),
      () => this.mobilePage.subMainEventCheck(),
      () => this.mobilePage.subMainPhoneCheck(),
      () => this.mobilePage.subMainPlanCheck(),
      () => this.mobilePage.subMainDeviceCheck(),
      () => this.mobilePage.subMenuCheck(),
    ]);
  }
  /**
   * 모바일 장바구니
   */
  async mobileCartCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.mobilePage.deviceSelectCheck(),
      () => this.mobilePage.addToCartCheck(),
      () => this.mobilePage.deleteCartCheck(),
    ]);
  }
  /**
   * 모바일 요금제
   */
  async mobilePlanCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.mobilePage.mobilePlanCheck(),
      () => this.mobilePage.comparePlanCheck(),
      () => this.mobilePage.changPlanCheck(),
    ]);
  }
}
