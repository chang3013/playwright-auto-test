/**
 * Description : 로그인/로그아웃/로그인  케이스
 * Date : 2025-06-11
 */
import { LoginPage } from '@e2e/ios-app/src/pages/LoginPage.js';
import type { Browser } from 'webdriverio';

export class LoginSteps {
  private readonly loginPage: LoginPage;

  constructor(driver: Browser) {
    this.loginPage = new LoginPage(driver);
  }

  /**
   * LG U+ 로그인button
   */
  // async loginTest(id: string, pw: string): Promise<void> {
  //   const success = await this.loginPage.doLoginUPLUS(id, pw);
  //   if (!success) {
  //     throw new Error('로그인 실패');
  //   }
  // }

  /**
   *비로그인 상태 --> 로그인
   *LG U+ 2.0 로그인
   */
  async loginTest(id: string, pw: string): Promise<boolean> {
    try {
      console.log('비로그인 상태 --> 로그인 실행');
      await this.loginPage.accountLogin(id, pw);
      return true;
    } catch (err) {
      console.log(err, '로그인 케이스 실패');
      return false;
    }
  }
  async logoutTest(): Promise<boolean> {
    try {
      await this.loginPage.doLogout();
      await this.loginPage.delay();
      return true;
    } catch (err) {
      console.log(err, '로그아웃 케이스 실패');
      return false;
    }
  }
  async reLoginTest(id: string, pw: string): Promise<boolean> {
    try {
      await this.loginPage.loginMenu();
      await this.loginPage.delay();
      await this.loginPage.accountLogin(id, pw);
      return true;
    } catch (err) {
      console.log(err, '로그인 케이스 실패');
      return false;
    }
  }
}
