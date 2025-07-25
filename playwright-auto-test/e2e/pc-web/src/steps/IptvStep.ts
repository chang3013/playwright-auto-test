import { BaseActions } from '@common/actions/BaseActions.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { IptvPage } from '@e2e/pc-web/src/pages/IptvPage.js';
import type { Page } from '@playwright/test';

export class IptvSteps extends BaseActions {
  private iptvPage: IptvPage;
  protected readonly platform: Platform = 'PC_WEB';
  protected readonly uiType: UIType = 'PC';

  constructor(page: Page) {
    super();
    this.iptvPage = new IptvPage(page);
  }

  async iptvTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.iptvPage.testStartAndMovePage(this.platform, urlLocator.iptv[this.platform], uiLocator.internetMenu[this.uiType]),
        () => this.iptvPage.keyVisualImageCheck(),
        () => this.iptvPage.themaBannerTextCheck(),
        () => this.iptvPage.eventImageCheck(),
        () => this.iptvPage.combineProductInfoCheck(),
        () => this.iptvPage.combineProductCounselReserve(),
        () => this.iptvPage.combineProductOnlineSign(),
        () => this.iptvPage.firstBebefitSectionCheck(),
        () => this.iptvPage.secondBebefitSectionCheck(),
      ],
    );
  }
}
