import { BaseActions } from '@common/actions/BaseActions.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { MainPage } from '@e2e/pc-web/src/pages/MainPage.js';
import type { Page } from '@playwright/test';

export class MainSteps extends BaseActions {
  private mainPage: MainPage;
  protected readonly platform: Platform = 'PC_WEB';
  protected readonly uiType: UIType = 'PC';

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
        () => this.mainPage.eventSectionCheck(),
        () => this.mainPage.recommendMobileSectionCheck(),
        () => this.mainPage.udocSectionCheck(),
        () => this.mainPage.planBenefitSectionCheck(),
        () => this.mainPage.ujamSectionCheck(),
        () => this.mainPage.customSectionCheck(),
      ],
    );
  }

  // 메인페이지 > 개인화 영역
  async mainMyTest(): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.mainPage.startInMainPage(),
        () => this.mainPage.toggleClickAndMyInfoOpen(),
        () => this.mainPage.myInfoTextCheck(),
        () => this.mainPage.myInfoNumberCheck(),
      ],
    );
  }
}
