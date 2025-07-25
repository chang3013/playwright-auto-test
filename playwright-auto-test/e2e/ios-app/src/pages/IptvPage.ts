import { AppActions } from '@common/actions/AppActions.js';
import { iptvLocator } from '@common/locators/iptvLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { join } from 'path';
import type { Browser } from 'webdriverio';

import { TextConstants } from '../../../../common/constants/TextConstants.js';

export class IptvPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }

  async goToIptvSub(): Promise<void> {
    console.log('IPTV 서브메인 화면 이동');
    await this.goToHome();
    await this.waitAndClick(uiLocator.hamburger[this.uiType]);
    await this.waitAndClick(iptvLocator.iptvGnb);
    await this.waitAndClick(iptvLocator.iptvSub);
    await this.waitForPageLoad();
    await this.closeAnyModal([...uiLocator.modal_selector]);
  }
  async iptvKVCheck(): Promise<boolean> {
    try {
      await this.goToIptvSub();
      return await this.imgCheck(iptvLocator.iosKvImg);
    } catch (err) {
      console.log(err, 'IPTV 서브메인 KV 이미지 요소 확인 실패');
      return false;
    }
  }

  async iptvBannerTextCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      return await this.textCheck(iptvLocator.iosBanner, TextConstants.IPTV_THEMA_BANNER);
    } catch (err) {
      console.log(err, 'IPTV 서브메인 테마배너 요소 확인 실패');
      return false;
    }
  }
  async iptvEventCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.smoothScrollTo(iptvLocator.eventSection);
      return await this.imgCheck(iptvLocator.benefitImg[this.uiType]);
    } catch (err) {
      console.log(err, 'IPTV 서브메인 이벤트 요소 확인 실패');
      return false;
    }
  }
  async combineProductReserveCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.smoothScrollTo(iptvLocator.combineProductSection);
      // await this.swipeToEnd(iptvLocator.combineSwiperSel);
      const focusedSelector = await this.swipeToRandomElement(iptvLocator.iosCounselReserveBtn);
      // await this.isDelay();
      // await this.waitAndClick(focusedSelector as string);
      await this.isDelay();
      await this.textCheck(iptvLocator.reserveModalTitle, TextConstants.IPTV_RESERVE_MODAL_TITLE);
      await this.closeAnyModal([...uiLocator.modal_selector]);
      return true;
    } catch (err) {
      console.log(err, 'IPTV 추천결합상품 상담신청 모달 요소 확인 실패');
      return false;
    }
  }
  async combineProductJoinCheck(): Promise<boolean> {
    try {
      await this.goToIptvSub();
      await this.isDelay();
      await this.smoothScrollTo(iptvLocator.combineProductSection);
      await this.swipeToRandomElement(iptvLocator.iosOnlineSignBtn);
      //const focusedSelector =
      await this.isDelay();
      // await this.waitAndClick(focusedSelector as string);
      await this.focusToClick(iptvLocator.onlineSignBenefitBtn[this.uiType]);
      await this.isDelay();
      await this.iosClick(iptvLocator.onlineSignBenefit[this.uiType]);
      await this.isDelay();
      await this.iosClick(iptvLocator.onlineSignBenefitGift[this.uiType]);
      await this.isDelay();
      await this.iosClick(iptvLocator.addBenefit);
      await this.isDelay();
      await this.iosClick(iptvLocator.setTopBox);
      await this.isDelay();
      await this.iosClick(iptvLocator.onlineSignDiscountBtn[this.uiType]);

      return await this.isCurrentUrlIncludes(iptvLocator.signUrl);
    } catch (err) {
      console.log(err, 'IPTV 추천결합상품 가입하기 요소 확인 실패');
      return false;
    }
  }
  async iptvBenefit1Check(): Promise<boolean> {
    try {
      await this.goToIptvSub();
      await this.isDelay();
      await this.smoothScrollTo(iptvLocator.iosBenefit1Section);
      return await this.imgCheck(iptvLocator.iosBenefitImg2);
    } catch (err) {
      console.log(err, 'IPTV 서브메인 혜택1 요소 확인 실패');
      return false;
    }
  }
  async iptvBenefit2Check(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.smoothScrollTo(iptvLocator.iosBenefit2Section);
      return await this.imgCheck(iptvLocator.benefitImg3[this.uiType]);
    } catch (err) {
      console.log(err, 'IPTV 서브메인 혜택2 요소 확인 실패');
      return false;
    }
  }
}
