import { AppActions } from '@common/actions/AppActions.js';
import { TextConstants } from '@common/constants/TextConstants.js';
import { mainLocator } from '@common/locators/mainLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { ContextUtils } from '@common/utils/context/contextUtils.js';
import { auth } from 'google-auth-library';
import type { Browser } from 'webdriverio';

export class MainPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }
  /**
   * 메인 개인화 영역 확인
   */
  async mainPersonal(): Promise<boolean> {
    try {
      const checkResult: boolean[] = [];
      await this.goToHome();
      //개인홤영역 추후 추가
      // await this.allTrue(checkResult);
      return true;
    } catch (err) {
      console.log(err, '메인페이지 개인화 영역 확인 실패');
      return false;
    }
  }
  async mainKVCheck(): Promise<boolean> {
    try {
      await this.goToHome();
      await this.isDelay();
      await this.smoothScrollTo(mainLocator.kvSection[this.uiType]);

      return await this.imgCheck(mainLocator.kvImg[this.uiType]);
    } catch (err) {
      console.log(err, '메인페이지 KV 요소 확인 실패');
      return false;
    }
  }
  async mainEventCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.smoothScrollTo(mainLocator.eventTitle[this.uiType]);
      await this.swipeToEnd(mainLocator.eventSlide);
      return await this.imgCheck(mainLocator.eventImg[this.uiType]);
    } catch (err) {
      console.log(err, '메인페이지 이벤트 요소 확인 실패');
      return false;
    }
  }
  async mainRecommendMobileCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.smoothScrollTo(mainLocator.mobileSection[this.uiType]);
      await this.swipeToEnd(mainLocator.mobileSlide);
      await this.waitAndClick(mainLocator.mobileBtn);
      await this.waitForPageLoad();
      await this.isDelay();
      return await this.isCurrentUrlIncludes(mainLocator.mobileUrl);
    } catch (err) {
      console.log(err, '메인페이지 인기 모바일 요소 확인 실패');
      return false;
    }
  }
  async mainBenefitPlanCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.goToHome();
      await this.smoothScrollTo(mainLocator.pricePlanSection);
      await this.swipeToEnd(mainLocator.priceSlide);
      await this.waitAndClick(mainLocator.priceBtn);
      await this.waitForPageLoad();
      await this.isDelay();
      return await this.isCurrentUrlIncludes(mainLocator.priceUrl);
    } catch (err) {
      console.log(err, '메인페이지 혜택 좋은 요금제 요소 확인 실패');
      return false;
    }
  }
  async mainIPTVCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.goToHome();
      await this.smoothScrollTo(mainLocator.homeSection);
      await this.elFind(mainLocator.homeATag);
      // 추후 둘중 하나 선택하도록 바꾸기
      await this.lastEltoClick(mainLocator.homeATag);
      await this.waitForPageLoad();
      await this.isDelay();
      return await this.isCurrentUrlIncludes(mainLocator.homePriceUrl);
    } catch (err) {
      console.log(err, '메인페이지 IPTV 요소 확인 실패');
      return false;
    }
  }
  async mainUjamCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.goToHome();
      await this.smoothScrollTo(mainLocator.recommendSection);
      await this.swipeToEnd(mainLocator.recommendSlide);
      await this.lastEltoClick(mainLocator.recommendATag);
      await this.waitForPageLoad();
      await this.isDelay();
      return await this.isCurrentUrlIncludes(mainLocator.ujamUrl);
    } catch (err) {
      console.log(err, '메인페이지 유잼 요소 확인 실패');
      return false;
    }
  }
  async mainUdocCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.goToHome();
      await this.smoothScrollTo(mainLocator.pogSection[this.uiType]);
      await this.swipeToEnd(mainLocator.pogSlide);
      return await this.imgCheck(mainLocator.pogImg);
    } catch (err) {
      console.log(err, '메인페이지 유독 요소 확인 실패');
      return false;
    }
  }
  async mainPhoneNumberCheck(): Promise<boolean> {
    try {
      await this.goToHome();
      await this.isDelay();
      return await this.textCheck(mainLocator.PhoneNumber, TextConstants.MAIN_MY_PHONE_NUMBER);
    } catch (err) {
      console.log(err, '메인페이지(개인화) 회선정보 요소 확인 실패');
      return false;
    }
  }
  async mainMyChargeCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      return await this.textCheck(mainLocator.myCharge[this.uiType], TextConstants.MAIN_MY_CHARGE);
    } catch (err) {
      console.log(err, '메인페이지(개인화) 청구요금 요소 확인 실패');
      return false;
    }
  }
  async mainMyToggleCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.waitAndClick(mainLocator.toggle[this.uiType]);
      await this.isDelay();
      return await this.isElementPresent(mainLocator.MyValueAddedService);
    } catch (err) {
      console.log(err, '메인페이지(개인화) 토글 영역 확인 실패');
      return false;
    }
  }
}
