import { AppActions } from '@common/actions/AppActions.js';
import { authLocator } from '@common/locators/authLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { ContextUtils } from '@common/utils/context/contextUtils.js';
import { auth } from 'google-auth-library';
import type { Browser } from 'webdriverio';

export class LoginPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }

  /**
   * 메뉴 > 로그아웃
   */
  async doLogout(): Promise<void> {
    try {
      await this.clickAndWaitForPageLoad(uiLocator.hamburger[this.uiType]);
      await this.driver.pause(1000);
      await this.clickAndWaitForPageLoad(authLocator.logoutButton);
      await this.driver.pause(1000);
      console.log('로그아웃 성공');
    } catch (err) {
      console.log('로그아웃 오류 : ', err);
    }
  }
  async loginMenu() {
    await this.waitAndClick(uiLocator.hamburger[this.uiType]);
    await this.waitAndClick(authLocator.menuLoginBtn);
    await this.driver.pause(500); // 안정화대기
    await this.switchToWebViewByUrl(authLocator.authUrl);
    await this.driver.pause(1000); // 안정화대기
  }

  async accountLogin(id: string, pw: string) {
    try {
      await this.clickIfPresent(authLocator.anotherWay);
      await this.waitAndClick(authLocator.uplusImgBtn);
      await this.typeSlowly(authLocator.uplusIdInputBox, id);
      await this.typeSlowly(authLocator.uplusPwInputBox, pw);
      await this.clickAndWaitForPageLoad(authLocator.uplusSubmitBtn);
      await this.driver.pause(1000);
      await this.switchToWebViewByUrl(authLocator.appUrl);
      await this.driver.pause(1000);
      await this.waitForPageLoad();
      await this.isElementPresent(authLocator.mainUseInfo);
      console.log('✅로그인 성공✅');
    } catch (e) {
      console.log(e, '로그인 실패');
    }
  }
  async delay() {
    await this.driver.pause(1500);
  }
}
