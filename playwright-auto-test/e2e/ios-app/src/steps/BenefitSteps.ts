import { AppActions } from '@common/actions/AppActions.js';
import { BenefitPage } from '@e2e/ios-app/src/pages/BenefitPage.js';
import type { Browser } from 'webdriverio';

let actions: AppActions;

export class BenefitSteps {
  private readonly benefitPage: BenefitPage;

  constructor(driver: Browser) {
    this.benefitPage = new BenefitPage(driver);
    actions = new AppActions(driver);
  }

  /**
   * 혜택(베네핏) 테스트 스탭
   */
  async benefitCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.benefitPage.benefitKV(),
      () => this.benefitPage.benefitCategoryCheck(),
      () => this.benefitPage.benefitPartnerCheck(),
      () => this.benefitPage.benefitPartnerAllUrl(),
      () => this.benefitPage.benefitEvent(),
    ]);
  }
  /**
   * 멤버십 테스트 스탭
   */
  async membershipCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.benefitPage.membershipCheck(),
      () => this.benefitPage.membershipTabCheck(),
      () => this.benefitPage.membershipUseListCheck(),
      () => this.benefitPage.membershipChangeCheck(),
    ]);
  }
}
