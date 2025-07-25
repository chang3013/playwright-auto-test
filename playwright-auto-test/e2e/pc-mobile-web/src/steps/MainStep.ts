import { BaseActions } from '@common/actions/BaseActions.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { MainPage } from '@e2e/pc-mobile-web/src/pages/MainPage.js';
import type { Page } from '@playwright/test';

export class MainSteps extends BaseActions {
  private mainPage: MainPage;
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super();
    this.mainPage = new MainPage(page);
  }

  // 메인페이지
  async mainTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.mainPage.startInMainPage(),
        () => this.mainPage.keyVisualImageCheck(),
        () => this.mainPage.udocSectionCheck(),
        () => this.mainPage.recommendMobileSectionCheck(),
        () => this.mainPage.recommendPlanSectionCheck(),
        () => this.mainPage.recommendIptvSectionCheck(),
        () => this.mainPage.useGuideSectionCheck(),
        () => this.mainPage.eventSectionCheck(),
        () => this.mainPage.ujamSectionCheck(),
        () => this.mainPage.ourLifeSectionCheck(),
        () => this.mainPage.suggestSectionCheck(),
      ],
    );
  }

  // 메인페이지 > 개인화 영역
  async mainMyTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.mainPage.startInMainPage(),
        () => this.mainPage.appDownloaSectionCheck(),
        () => this.mainPage.myPageSectionCheck(),
        () => this.mainPage.benefitSectionCheck(),
      ],
    );
  }
}
