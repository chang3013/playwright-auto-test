import { AppActions } from '@common/actions/AppActions.js';
import { MyPage } from '@e2e/ios-app/src/pages/MyPage.js';
import type { Browser } from 'webdriverio';

let actions: AppActions;
export const testResults: boolean[] = [];
export class MySteps {
  private readonly myPage: MyPage;

  constructor(driver: Browser) {
    this.myPage = new MyPage(driver);
    actions = new AppActions(driver);
  }

  /**
   * 마이 페이지 서브메인 스탭
   */
  async mySubMainCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.myPage.mySubMainPayment(),
      () => this.myPage.paymentMore(),
    ]);
  }
  /**
   * 마이 페이지 요금/납부 스탭
   */
  async myBillsCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.myPage.claimSectionCheck(),
      () => this.myPage.paymentSectionCheck(),
      () => this.myPage.paymentMore(),
    ]);
  }
  /**
   * 마이 페이지 요금/납부 스탭
   */
  async myUseCase(): Promise<boolean> {
    return actions.runTestSteps([
      () => this.myPage.myUseTabCheck(),
      () => this.myPage.myRealTimePaymentCheck(),
      () => this.myPage.myMonthUseDataCheck(),
      () => this.myPage.myCallDetailCheck(),
    ]);
  }
}
