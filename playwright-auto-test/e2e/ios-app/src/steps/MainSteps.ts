import { AppActions } from '@common/actions/AppActions.js';
import { MainPage } from '@e2e/ios-app/src/pages/MainPage.js';
import type { Browser } from 'webdriverio';

let actions: AppActions;

export class MainSteps {
  private readonly mainPage: MainPage;

  constructor(driver: Browser) {
    this.mainPage = new MainPage(driver);
    actions = new AppActions(driver);
  }

  /**
   * 메인 페이지 스탭
   */
  async mainCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.mainPage.mainKVCheck(),
      () => this.mainPage.mainEventCheck(),
      () => this.mainPage.mainUdocCheck(),
      () => this.mainPage.mainRecommendMobileCheck(),
      () => this.mainPage.mainBenefitPlanCheck(),
      () => this.mainPage.mainIPTVCheck(),
      () => this.mainPage.mainUjamCheck(),
    ]);
  }
  /**
   * 메인 페이지 스탭
   */
  async mainMyUsedCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.mainPage.mainPhoneNumberCheck(),
      () => this.mainPage.mainMyChargeCheck(),
      () => this.mainPage.mainMyToggleCheck(),
    ]);
  }
}
