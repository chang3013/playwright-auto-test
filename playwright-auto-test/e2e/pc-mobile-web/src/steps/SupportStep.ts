import { BaseActions } from '@common/actions/BaseActions.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { SupportPage } from '@e2e/pc-mobile-web/src/pages/SupportPage.js';
import type { Page } from '@playwright/test';

export class SupportSteps extends BaseActions {
  private supportPage: SupportPage;
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super();
    this.supportPage = new SupportPage(page);
  }

  async supportTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.supportPage.testStartAndMovePage(this.platform, urlLocator.support[this.platform], uiLocator.supportMenu[this.uiType], uiLocator.subMainBtn[this.uiType]),
        () => this.supportPage.keywordClickAndResultCheck(),
        () => this.supportPage.questionListElementCheck(),
        () => this.supportPage.solutionSectionCheck(),
        () => this.supportPage.moveGuidePageAndTextCheck(),
      ],
    );
  }
}
