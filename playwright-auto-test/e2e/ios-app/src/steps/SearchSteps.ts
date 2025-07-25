import { AppActions } from '@common/actions/AppActions.js';
import { SearchPage } from '@e2e/ios-app/src/pages/SearchPage.js';
import type { Browser } from 'webdriverio';

let actions: AppActions;
export const testResults: boolean[] = [];
export class SearchSteps {
  private readonly searchPage: SearchPage;
  constructor(driver: Browser) {
    this.searchPage = new SearchPage(driver);
    actions = new AppActions(driver);
  }
  /**
   * 검색 테스트 스탭
   */
  async searchCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.searchPage.searchPageCheck(),
      () => this.searchPage.optionTerm(),
      () => this.searchPage.specialTerm(),
      () => this.searchPage.noneTerm(),
      () => this.searchPage.hashTagTerm(),
    ]);
  }
}
