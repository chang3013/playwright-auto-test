import { BaseActions } from '@common/actions/BaseActions.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { SearchPage } from '@e2e/pc-mobile-web/src/pages/SearchPage.js';
import type { Page } from '@playwright/test';

export class SearchSteps extends BaseActions {
  private searchPage: SearchPage;
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super();
    this.searchPage = new SearchPage(page);
  }

  // 검색 페이지
  async searchTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.searchPage.searchButtonClick(),
        () => this.searchPage.clickKeywordAndTextCheck(),
        () => this.searchPage.searchKeywordAndResultCheck(),
      ],
    );
  }
}
