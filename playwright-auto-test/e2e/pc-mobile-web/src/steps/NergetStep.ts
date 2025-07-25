import { BaseActions } from '@common/actions/BaseActions.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { NergetPage } from '@e2e/pc-mobile-web/src/pages/NergetPage.js';
import type { Page } from '@playwright/test';

export class NergetSteps extends BaseActions {
  private nergetPage: NergetPage;
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super();
    this.nergetPage = new NergetPage(page);
  }

  async nergetTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.nergetPage.testStartAndMovePage(this.platform, urlLocator.nerget[this.platform], uiLocator.nurgetMenu[this.uiType], uiLocator.subMainBtn[this.uiType]),
        () => this.nergetPage.usimNewSignAndResultCheck(),
        () => this.nergetPage.nergetMoreButtonClickAndMovePageCheck(),
        () => this.nergetPage.nergetPlanInfoCheck(),
        () => this.nergetPage.benefitSectionCheck(),
        () => this.nergetPage.reviewSectionCheck(),
        () => this.nergetPage.eventSectionCheck(),
        () => this.nergetPage.eventSectionCheck(),
        () => this.nergetPage.noticeSectionCheck(),
      ],
    );
  }
}
