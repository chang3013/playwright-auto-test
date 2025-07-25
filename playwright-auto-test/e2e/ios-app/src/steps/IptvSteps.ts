import { AppActions } from '@common/actions/AppActions.js';
import { IptvPage } from '@e2e/ios-app/src/pages/IptvPage.js';
import type { Browser } from 'webdriverio';

let actions: AppActions;
export class IptvSteps {
  private readonly iptvPage: IptvPage;

  constructor(driver: Browser) {
    this.iptvPage = new IptvPage(driver);
    actions = new AppActions(driver);
  }

  /**
   * iptv케이스
   */
  async iptvCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.iptvPage.iptvKVCheck(),
      () => this.iptvPage.iptvBannerTextCheck(),
      () => this.iptvPage.iptvEventCheck(),
      () => this.iptvPage.combineProductReserveCheck(),
      () => this.iptvPage.combineProductJoinCheck(),
      () => this.iptvPage.iptvBenefit1Check(),
      () => this.iptvPage.iptvBenefit2Check(),
    ]);
  }
}
