import { WebActions } from '@common/actions/WebActions.js';
import { TextConstants } from '@common/constants/TextConstants.js';
import { iptvLocator } from '@common/locators/iptvLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';

export class IptvPage extends WebActions {
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super(page);
  }

  async keyVisualImageCheck(): Promise<boolean> {
    try {
      // KV
      await this.checkImg(iptvLocator.kvImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[keyVisualImageCheck Failed]', err);
      return false;
    }
  }

  async themaBannerTextCheck(): Promise<boolean> {
    try {
      // 테마배너
      await this.checkText(iptvLocator.banner[this.uiType], TextConstants.IPTV_THEMA_BANNER);
      return true;
    } catch (err) {
      console.error('[themaBannerTextCheck Failed]', err);
      return false;
    }
  }

  async eventImageCheck(): Promise<boolean> {
    try {
      // 추천 이벤트
      await this.checkImg(iptvLocator.benefitImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[eventImageCheck Failed]', err);
      return false;
    }
  }

  private count: number
  private num: number

  async combineProductInfoCheck(): Promise<boolean> {
    try {
      // 추천 결합 상품
      // 총 납부금액
      const totalPrice = await this.getLocator(iptvLocator.recommPlanPayment[this.uiType]);
      this.count = await totalPrice.count();
      this.num = await this.getRandomInt(0, this.count-1);

      await this.checkPositiveNumber(totalPrice.nth(this.num));
      return true;
    } catch (err) {
      console.error('[combineProductInfoCheck Failed]', err);
      return false;
    }
  }

  async combineProductCounselReserve(): Promise<boolean> {
    try {
      // 추천 결합 상품
      // 상담 예약하기
      const reserveBtn = await this.getLocator(iptvLocator.counselReserveBtn[this.uiType]);
      await this.click(reserveBtn.nth(this.num));

      await this.checkText(uiLocator.modalContent, TextConstants.IPTV_COUNSEL_RESERVE);
      // 가입상담 신청 창 닫기
      await this.click(uiLocator.modalHeaderClose);
      return true;
    } catch (err) {
      console.error('[combineProductCounselReserve Failed]', err);
      return false;
    }
  }

  async combineProductOnlineSign(): Promise<boolean> {
    try {
      // 추천 결합 상품
      // 온라인 가입
      const signBtn = await this.getLocator(iptvLocator.onlineSignBtn[this.uiType]);

      // 가입상품 선택 페이지 진입
      await this.click(signBtn.nth(this.num));
      await this.checkURL(urlLocator.onlineSignUp[this.platform]);
      // 가입 혜택 선택하기 버튼
      await this.click(iptvLocator.onlineSignBenefitBtn[this.uiType]);
      // 가입 혜택 선택
      const benefitList = await this.getLocator(iptvLocator.onlineSignBenefit[this.uiType]);
      this.count = await benefitList.count();

      for (let i = 0; i < this.count; i++) {
        await this.click(benefitList.nth(i).locator(iptvLocator.onlineSignBenefitList[this.uiType]));
        if (i === 0) {
          await this.clickIfExists(benefitList.nth(i).locator(iptvLocator.onlineSignBenefitGift[this.uiType]));
        }
      }
      // U+ 휴대폰 결합 할인 받기 버튼
      await this.waitForVisible(iptvLocator.onlineSignDiscountBtn[this.uiType]);
      await this.click(iptvLocator.onlineSignDiscountBtn[this.uiType]);
      await this.checkPositiveNumber(iptvLocator.onlineSignPayment[this.uiType]);

      // 가입신청서 페이지 진입
      await this.click(iptvLocator.onlineSignApplyBtn[this.uiType]);
      await this.checkURL(urlLocator.applicationForm2[this.platform]);

      await this.gotoURL(urlLocator.iptv[this.platform]);
      return true;
    } catch (err) {
      console.error('[combineProductOnlineSign Failed]', err);
      return false;
    }
  }

  async firstBebefitSectionCheck(): Promise<boolean> {
    try {
      // 더 나은 일상
      await this.checkImg(iptvLocator.benefitImg2[this.uiType]);
      return true;
    } catch (err) {
      console.error('[firstBebefitSectionCheck Failed]', err);
      return false;
    }
  }

  async secondBebefitSectionCheck(): Promise<boolean> {
    try {
      // 혜택
      await this.checkImg(iptvLocator.benefitImg3[this.uiType]);
      return true;
    } catch (err) {
      console.error('[firstBebefitSectionCheck Failed]', err);
      return false;
    }
  }
}
