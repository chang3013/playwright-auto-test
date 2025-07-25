import { WebActions } from '@common/actions/WebActions.js';
import { authLocator } from '@common/locators/authLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';

export class LoginPage extends WebActions {
  protected readonly platform: Platform = 'PC_WEB';
  protected readonly uiType: UIType = 'PC';

  constructor(page: Page) {
    super(page);
  }

  async gotoLoginPage(): Promise<boolean> {
    try {
      await this.ensureJs().forceFocus(authLocator.myInfoIcon[this.uiType]);
      await this.click(authLocator.mainLoginButton[this.uiType]);
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
