import { BaseActions } from '@common/actions/BaseActions.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { UjamPage } from '@e2e/pc-web/src/pages/UjamPage.js';
import type { Page } from '@playwright/test';

export class UjamSteps extends BaseActions {
  private ujamPage: UjamPage;
  protected readonly platform: Platform = 'PC_WEB';
  protected readonly uiType: UIType = 'PC';

  constructor(page: Page) {
    super();
    this.ujamPage = new UjamPage(page);
  }

  async ujamTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.ujamPage.testStartAndMovePage(this.platform, urlLocator.ujamUrl[this.platform], uiLocator.benefitMenu[this.uiType], uiLocator.ujam[this.uiType]),
      ],
    );
  }
}
