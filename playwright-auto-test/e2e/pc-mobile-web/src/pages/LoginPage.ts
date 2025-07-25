import { WebActions } from '@common/actions/WebActions.js';
import { authLocator } from '@common/locators/authLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';

export class LoginPage extends WebActions {
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super(page);
  }

  async gotoLoginPage(): Promise<boolean> {
    try {
      // 햄버거 버튼 클릭
      await this.click(uiLocator.hamburger[this.uiType]);
      // 메인 로그인 버튼 클릭
      await this.click(authLocator.mainLoginButton[this.uiType]);
      // 로그인 타이틀 노출 확인
      const regex = new RegExp(`.*${urlLocator.login_v2}`);
      await this.ensurePage().waitForURL(regex, { timeout: 10000 });

      await this.click(authLocator.uplusLoginButton2);
      await this.waitSelector(authLocator.uplusLoginTitle2[this.uiType]);
      return true;
    } catch (err) {
      console.error('[gotoLoginPage2 Failed]', err);
      return false;
    }
  }

  async doUplusLogin(id: string, pw: string): Promise<boolean> {
    try {
      await this.clickIfExists(authLocator.uplusClearButton2);
      await this.typeTextSlowly(authLocator.uplusIdInput, id);
      await this.typeTextSlowly(authLocator.uplusPwInput, pw);
      await this.waitTime(2);
      await this.click(authLocator.uplusLoginSubmitButton2);
      await this.checkURL(urlLocator.main[this.platform]);
      return true;
    } catch (err) {
      console.error('[doUplusLogin2 Failed]', err);
      return false;
    }
  }
}
