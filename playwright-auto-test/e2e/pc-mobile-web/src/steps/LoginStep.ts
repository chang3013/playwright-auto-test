import { BaseActions } from '@common/actions/BaseActions.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { LoginPage } from '@e2e/pc-mobile-web/src/pages/LoginPage.js';
import type { Page } from '@playwright/test';

export class LoginSteps extends BaseActions {
  private loginPage: LoginPage;
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super();
    this.loginPage = new LoginPage(page);
  }

  /**
   * U+ 로그인 2.0
   */
  async doUplusLoginTest(id: string, pw: string): Promise<boolean> {
    return this.runTestSteps(
      [
        () => this.loginPage.startInMainPage(),
        () => this.loginPage.gotoLoginPage(),
        () => this.loginPage.doUplusLogin(id, pw),
      ],
    );
  }
}
