import { AppActions } from '@common/actions/AppActions.js';
import { mypageLocator } from '@common/locators/mypageLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { ContextUtils } from '@common/utils/context/contextUtils.js';
import { auth } from 'google-auth-library';
import { text } from 'stream/consumers';
import type { Browser } from 'webdriverio';



import { TextConstants } from '../../../../common/constants/TextConstants.js';





export class MyPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }
  /**
   * 마이 페이지이동
   */
  async goToMy(): Promise<void> {
    await this.goToHome();
    await this.waitAndClick(uiLocator.hamburger[this.uiType]);
    await this.waitAndClick(mypageLocator.myGnb);
    await this.waitAndClick(mypageLocator.mySubMainBtn);
    await this.waitForPageLoad();
    await this.isDelay();
  }
  /**
   * 마이페이지 청구요금 확인
   */
  async mySubMainPayment(): Promise<boolean> {
    try {
      await this.goToMy();
      await this.isDelay();
      await this.waitForPageLoad();
      await this.smoothScrollTo(mypageLocator.myInfoCharge[this.uiType]);
      const targetText = await this.getInnerText(mypageLocator.myInfoCharge[this.uiType]);
      console.log(targetText);
      return await this.isTextEqual(targetText, TextConstants.MYPAGE_PAYMENT);
    } catch (err) {
      console.log(err, '[마이페이지] 청구정보 확인 실패');
      return false;
    }
  }
  /**
   * 마이페이지&요금/납부 > 청구서 더보기
   */
  async paymentMore(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.iosClick(mypageLocator.iosInfoMoreBtn);
      await this.isDelay();
      await this.textCheck(mypageLocator.iosMoreInfoCharge, TextConstants.MYPAGE_PAYMENT);
      await this.closeAnyModal([...uiLocator.modal_selector]);
      return true;
    } catch (err) {
      console.log(err, '[마이페이지] 청구서 더보기 확인 실패');
      return false;
    }
  }
  /**
   * 요금납부 이동
   */
  async goToChargeHome(): Promise<void> {
    await this.goToHome();
    await this.waitAndClick(uiLocator.hamburger[this.uiType]);
    await this.waitAndClick(mypageLocator.myGnb);
    await this.waitAndClick(mypageLocator.paymentMenu);
    await this.waitAndClick(mypageLocator.paymentJoin);
    await this.waitForPageLoad();
    await this.iosClick(mypageLocator.billPageBtn);
    await this.waitForPageLoad();
    await this.isDelay();
  }
  /**
   * 마이페이지 > 요금/납부 > 청구내역 요소 확인
   */
  async claimSectionCheck(): Promise<boolean> {
    try {
      await this.goToChargeHome();
      await this.smoothScrollTo(mypageLocator.moreBtn);
      return await this.textCheck(
        (await this.getNthSelector(mypageLocator.iosChargeAmount)) as string,
        TextConstants.MYPAGE_PAYMENT,
      );
    } catch (err) {
      console.log(err, '[마이페이지] 요금/납부 조회 청구내역 요소 확인 실패 ');
      return false;
    }
  }
  /**
   * 마이페이지 > 요금/납부 조회 > 납부내역 요소 확인
   */
  async paymentSectionCheck(): Promise<boolean> {
    try {
      await this.waitAndClick(mypageLocator.iosPaymentTitle);
      await this.isDelay();
      await this.smoothScrollTo(mypageLocator.listBox);
      return await this.textCheck(
        (await this.getNthSelector(mypageLocator.iosPaymentAmount)) as string,
        TextConstants.MYPAGE_PAYMENT,
      );
    } catch (err) {
      console.log(err, '[마이페이지] 요금/납부 납부내역 요소 확인 실패');
      return false;
    }
  }
  /**
   * 마이페이지 > 사용내역 조회 이동
   */
  async goToMyUse(): Promise<void> {
    await this.goToHome();
    await this.waitAndClick(uiLocator.hamburger[this.uiType]);
    await this.waitAndClick(mypageLocator.myGnb);
    await this.waitAndClick(mypageLocator.myPageUsedMenu);
    await this.waitAndClick(mypageLocator.myPageUseHistory);
    await this.isDelay();
  }
  /**
   * 마이페이지 > 사용내역 조회 > 탭 요소 확인
   */
  async myUseTabCheck(): Promise<boolean> {
    try {
      await this.goToMyUse();
      await this.isDelay();
      return await this.textCheck(mypageLocator.iosuseTab, TextConstants.MYUSE_TAB);
    } catch (err) {
      console.log(err, '[마이페이지] 사용내역 조회 탭리스트 요소 확인 실패');
      return false;
    }
  }
  /**
   * 마이페이지 > 사용내역 조회 > 실시간 요금 조회 요소 확인
   */
  async myRealTimePaymentCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.smoothScrollTo(mypageLocator.iosUseTotalCharge);
      return await this.isTextEqual(
        await this.getInnerText(mypageLocator.iosUseCharge),
        await this.getInnerText(mypageLocator.iosUseTotalCharge),
      );
    } catch (err) {
      console.log(err, '[마이페이지] 실시간 요금 조회 요소 확인 실패');
      return false;
    }
  }
  /**
   * 마이페이지 > 사용내역 조회 > 월별 사용량 조회
   */
  async myMonthUseDataCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.waitAndClick(mypageLocator.iosUseMonthTab);
      await this.waitAndClick(mypageLocator.iosMonthDetailBtn);
      await this.textCheck(
        mypageLocator.iosMonthDetailTab,
        TextConstants.APP_MYUSE_MONTH_DETAIL_TAB,
      );
      await this.closeAnyModal([...uiLocator.modal_selector]);
      return true;
    } catch (err) {
      console.log(err, '[마이페이지] 월별 사용량 조회 요소 확인 실패');
      return false;
    }
  }
  /**
   * 마이페이지 > 사용내역 조회 > 통화 상세 내역
   */
  async myCallDetailCheck(): Promise<boolean> {
    try {
      await this.goToMyUse();
      await this.isDelay();
      await this.waitAndClick(mypageLocator.iosCallDetailTab);
      await this.waitAndClick(mypageLocator.iosCallDetailBtn);
      await this.isDelay();
      await this.textCheck(mypageLocator.callDetailModal, TextConstants.MY_USE_CALL_DETAIL);
      await this.closeAnyModal([...uiLocator.modal_selector]);
      return true;
    } catch (err) {
      console.log(err, '[마이페이지] 월별 사용량 조회 요소 확인 실패');
      return false;
    }
  }
}
