import { WebActions } from '@common/actions/WebActions.js';
import { TextConstants } from '@common/constants/TextConstants.js';
import { nergetLocator } from '@common/locators/nergetLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';

export class NergetPage extends WebActions {
  protected readonly platform: Platform = 'PC_WEB';
  protected readonly uiType: UIType = 'PC';

  constructor(page: Page) {
    super(page);
  }

  async usimNewSignAndResultCheck(): Promise<boolean> {
    try {
      // USIM 신규가입
      await this.click(nergetLocator.usimSignBtn[this.uiType]);
      await this.checkURL(urlLocator.nerget_usim[this.platform]);

      const planName = await this.getLocator(nergetLocator.usimPlanName[this.uiType]).innerText();
      const planPrice = await this.getLocator(nergetLocator.usimPayment[this.uiType]);

      await this.checkPositiveNumber(planPrice);

      await this.checkCommonModals();
      // VIP 멤버십 혜택
      await this.click(nergetLocator.usimMembershipBenefit[this.uiType]);
      // 너겟 쿠폰 선택
      await this.click(nergetLocator.usimNergetCoupon[this.uiType]);

      // 가입신청서 페이지 진입 / 새 탭 열림
      await this.switchContext(nergetLocator.usimSignApplyBtn[this.uiType]);
      await this.checkURL(urlLocator.usim_signup[this.platform]);
      // 개통 사기 피해 예방 안내 팝업 닫기
      await this.checkCommonModals();
      await this.checkText(uiLocator.body, TextConstants.NERGET_APPLICATION_FORM);

      await this.checkText(nergetLocator.signApplyPlanName[this.uiType], planName);
      await this.checkPositiveNumber(nergetLocator.signApplyPayment[this.uiType]);

      // 기존 페이지로 전환
      await this.returnContext();
      await this.gotoURL(urlLocator.nerget[this.platform]);
      return true;
    } catch (err) {
      console.error('[usimNewSignAndResultCheck Failed]', err);
      return false;
    }
  }

  async nergetMoreButtonClickAndMovePageCheck(): Promise<boolean> {
    try {
      // 너겟 둘러보기
      await this.switchContext(nergetLocator.nergetMore[this.uiType]);
      await this.checkURL(urlLocator.nerget_main[this.platform]);
      await this.returnContext();
      return true;
    } catch (err) {
      console.error('[nergetMoreButtonClickAndMovePageCheck Failed]', err);
      return false;
    }
  }

  async nergetPlanInfoCheck(): Promise<boolean> {
    try {
      // 요금제
      const planPriceList = await this.getLocator(nergetLocator.planPrice[this.uiType]);
      const planBenefitPriceList = await this.getLocator(nergetLocator.planBenefitPrice[this.uiType]);
      const planSignBtnList = await this.getLocator(nergetLocator.planSignBtn[this.uiType]);

      let count = await planSignBtnList.count();
      let num = this.getRandomInt(0, count-1);

      await this.checkPositiveNumber(planPriceList.nth(num));
      await this.checkPositiveNumber(planBenefitPriceList.nth(num));
      // 가입하기 버튼
      await this.click(planSignBtnList.nth(num));
      await this.checkURL(urlLocator.nerget_usim[this.platform]);

      const planName = await this.getLocator(nergetLocator.usimPlanName[this.uiType]).innerText();
      const planPrice = await this.getLocator(nergetLocator.usimPayment[this.uiType]);

      await this.checkPositiveNumber(planPrice);

      // VIP 멤버십 혜택
      await this.click(nergetLocator.usimMembershipBenefit[this.uiType]);
      // 너겟 쿠폰 선택
      await this.click(nergetLocator.usimNergetCoupon[this.uiType]);

      // 가입신청서 페이지 진입 / 새 탭 열림
      await this.switchContext(nergetLocator.usimSignApplyBtn[this.uiType]);
      await this.checkURL(urlLocator.usim_signup[this.platform]);
      // 개통 사기 피해 예방 안내 팝업 닫기
      await this.checkCommonModals();
      await this.checkText(uiLocator.body, TextConstants.NERGET_APPLICATION_FORM);

      await this.checkText(nergetLocator.signApplyPlanName[this.uiType], planName);
      await this.checkPositiveNumber(nergetLocator.signApplyPayment[this.uiType]);

      // 기존 페이지로 전환
      await this.returnContext();
      await this.gotoURL(urlLocator.nerget[this.platform]);

      // 요금제 전체보기 버튼
      await this.click(nergetLocator.planAllBtn[this.uiType]);
      await this.checkURL(urlLocator.nerget_plan[this.platform]);
      await this.gotoURL(urlLocator.nerget[this.platform]);
      return true;
    } catch (err) {
      console.error('[nergetPlanInfoCheck Failed]', err);
      return false;
    }
  }

  async benefitSectionCheck(): Promise<boolean> {
    try {
      // 혜택
      await this.checkEl(nergetLocator.benefit[this.uiType]);
      return true;
    } catch (err) {
      console.error('[benefitSectionCheck Failed]', err);
      return false;
    }
  }

  async reviewSectionCheck(): Promise<boolean> {
    try {
      // 고객 리뷰
      await this.checkImg(nergetLocator.review[this.uiType]);
      return true;
    } catch (err) {
      console.error('[reviewSectionCheck Failed]', err);
      return false;
    }
  }

  async eventSectionCheck(): Promise<boolean> {
    try {
      // 꿀혜택 이벤트
      await this.checkImg(nergetLocator.event[this.uiType]);
      return true;
    } catch (err) {
      console.error('[eventSectionCheck Failed]', err);
      return false;
    }
  }

  async noticeSectionCheck(): Promise<boolean> {
    try {
      // 꼭 확인하세요
      await this.checkEl(nergetLocator.notice[this.uiType]);
      return true;
    } catch (err) {
      console.error('[noticeSectionCheck Failed]', err);
      return false;
    }
  }
}
