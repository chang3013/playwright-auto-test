import { AppActions } from '@common/actions/AppActions.js';
import { SupportPage } from '@e2e/ios-app/src/pages/SupportPage.js';
import type { Browser } from 'webdriverio';

let actions: AppActions;
export class SupportSteps {
  private readonly supportPage: SupportPage;

  constructor(driver: Browser) {
    this.supportPage = new SupportPage(driver);
    actions = new AppActions(driver);
  }
  /**
   * 고객지원 테스트 스탭
   */
  async supportCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.supportPage.favoriteSearchCase(),
      //() => this.supportPage.listOpen(), 추후 기능 추가
      () => this.supportPage.helpSupportList(),
      () => this.supportPage.useGuide(),
    ]);
  }
}
