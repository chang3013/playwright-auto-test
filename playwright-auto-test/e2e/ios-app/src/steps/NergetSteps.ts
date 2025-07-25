import { AppActions } from '@common/actions/AppActions.js';
import { NergetPage } from '@e2e/ios-app/src/pages/NergetPage.js';
import type { Browser } from 'webdriverio';

let actions: AppActions;

export class NergetSteps {
  private readonly nergetPage: NergetPage;

  constructor(driver: Browser) {
    this.nergetPage = new NergetPage(driver);
    actions = new AppActions(driver);
  }

  /**
   * 너겟 페이지 케이스
   */
  async nergetCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.nergetPage.usimJoinCase(),
      () => this.nergetPage.nergetInfoCheck(),
      () => this.nergetPage.nergetPlanCheck(),
      () => this.nergetPage.nergetPlanAll(),
      () => this.nergetPage.nergetBenefitCheck(),
      () => this.nergetPage.nergetReviewCheck(),
      () => this.nergetPage.nergetEventCheck(),
    ]);
  }
}
