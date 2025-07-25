import { BaseActions } from '@common/actions/BaseActions.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { BenefitPage } from '@e2e/pc-web/src/pages/BenefitPage.js';
import type { Page } from '@playwright/test';

export class BenefitSteps extends BaseActions {
  private benefitPage: BenefitPage;
  protected readonly platform: Platform = 'PC_WEB';
  protected readonly uiType: UIType = 'PC';

  constructor(page: Page) {
    super();
    this.benefitPage = new BenefitPage(page);
  }

  async benefitTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.benefitPage.testStartAndMovePage(this.platform, urlLocator.benefit[this.platform], uiLocator.benefitMenu[this.uiType]),
        () => this.benefitPage.keyVisualImageCheck(),
        () => this.benefitPage.themaBannerTextCheck(),
        () => this.benefitPage.membershipBenefitSectionCheck(),
        () => this.benefitPage.onlineSignBenefitSectionCheck(),
        () => this.benefitPage.eventSectionCheck(),
      ],
    );
  }

  async membershipTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.benefitPage.testStartAndMovePage(this.platform, urlLocator.membership[this.platform], uiLocator.benefitMenu[this.uiType],
        uiLocator.membership[this.uiType]),
        () => this.benefitPage.membershipInfoTextCheck(),
        () => this.benefitPage.membershipTabTextCheck(),
        () => this.benefitPage.membershipUsageSectionCheck(),
        () => this.benefitPage.membershipChangeSectionCheck(),
      ],
    );
  }
}
