import { BaseActions } from '@common/actions/BaseActions.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { MobilePage } from '@e2e/pc-mobile-web/src/pages/MobilePage.js';
import type { Page } from '@playwright/test';

export class MobileSteps extends BaseActions {
  private mobilePage: MobilePage;
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super();
    this.mobilePage = new MobilePage(page);
  }

  async mobileTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.mobilePage.testStartAndMovePage(this.platform, urlLocator.mobile[this.platform], uiLocator.mobileMenu[this.uiType], uiLocator.subMainBtn[this.uiType]),
        () => this.mobilePage.keyVisualImageCheck(),
        () => this.mobilePage.themaBannerSectionCheck(),
        () => this.mobilePage.eventSectionCheck(),
        () => this.mobilePage.phoneSectionCheck(),
        () => this.mobilePage.recommendPlanSectionCheck(),
        () => this.mobilePage.deviceSectionCheck(),
        () => this.mobilePage.submenuSectionCheck(),
      ],
    );
  }

  async mobileCartTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.mobilePage.testStartAndMovePage(this.platform, urlLocator.phone[this.platform], uiLocator.mobileMenu[this.uiType],
        uiLocator.mobilePhone[this.uiType]),
        () => this.mobilePage.phoneInfoCollectAndMoveDetailPage(),
        () => this.mobilePage.selectConditionAndMoveCartPage(),
        () => this.mobilePage.cartPageCheckAndDeleteProduct(),
      ],
    );
  }

  async mobilePlanTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.mobilePage.testStartAndMovePage(this.platform, urlLocator.plan[this.platform], uiLocator.mobileMenu[this.uiType],
        uiLocator.mobilePlan[this.uiType]),
        () => this.mobilePage.dropdownClickAndMyInfoCheck(),
        () => this.mobilePage.tabTextAndUrlAndListCheck(),
      ],
    );
  }

  async mobilePlanChangeTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.mobilePage.testStartAndMovePage(this.platform, urlLocator.plan[this.platform], uiLocator.mobileMenu[this.uiType],
        uiLocator.mobilePlan[this.uiType]),
        () => this.mobilePage.planInfoCollectAndMoveChangePage(),
        () => this.mobilePage.planChangeTextAndNumberCheck(),
      ],
    );
  }

  async mobilePlanCompareTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.mobilePage.testStartAndMovePage(this.platform, urlLocator.plan[this.platform], uiLocator.mobileMenu[this.uiType],
        uiLocator.mobilePlan[this.uiType]),
        () => this.mobilePage.planInfoCollectAndMoveComparePage(),
        () => this.mobilePage.planCompareTextAndNumberCheck(),
      ],
    );
  }
}
