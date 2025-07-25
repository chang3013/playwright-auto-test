import { BaseActions } from '@common/actions/BaseActions.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { UdocPage } from '@e2e/pc-mobile-web/src/pages/UdocPage.js';
import type { Page } from '@playwright/test';

export class UdocSteps extends BaseActions {
  private udocPage: UdocPage;
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super();
    this.udocPage = new UdocPage(page);
  }

  async udocTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.udocPage.testStartAndMovePage(this.platform, urlLocator.udocUrl[this.platform], uiLocator.udocMenu[this.uiType])
      ],
    );
  }
}
