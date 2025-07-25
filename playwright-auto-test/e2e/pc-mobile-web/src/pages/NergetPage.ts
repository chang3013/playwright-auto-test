import { WebActions } from '@common/actions/WebActions.js';
import { nergetLocator } from '@common/locators/nergetLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';

export class NergetPage extends WebActions {
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super(page);
  }

  async usimNewSignAndResultCheck(): Promise<boolean> {
    try {
      // USIM 신규가입
      await this.click(nergetLocator.usimSignBtn[this.uiType]);
      await this.checkURL(urlLocator.usim_detail[this.platform]);
      // 유심카드 소지 여부
      await this.checkCommonModals();
      await this.click(nergetLocator.usimCard[this.uiType], false);
      // 가입 유형
      await this.checkCommonModals();
      await this.click(nergetLocator.usimSignType[this.uiType], false);
      // 가입 방법
      await this.checkCommonModals();
      await this.click(nergetLocator.usimSignWay[this.uiType], false);
      // 요금제
      await this.checkCommonModals();
      await this.click(nergetLocator.usimSignPlan[this.uiType], false);
      let planName = await this.getLocator(nergetLocator.usimPlanName[this.uiType]).innerText();
      // 할인 방법
      await this.checkCommonModals();
      await this.click(nergetLocator.usimSignDiscount[this.uiType], false);
      // VIP 멤버십 혜택
      await this.checkCommonModals();
      await this.click(nergetLocator.usimMembershipBenefit[this.uiType], false);
      // 너겟 특별한 혜택
      await this.checkCommonModals();
      await this.click(nergetLocator.usimNergetCoupon[this.uiType], false);
      // 예상 월 납부 금액
      let planPrice = await this.getLocator(nergetLocator.usimPayment[this.uiType]);
      await this.checkPositiveNumber(planPrice);

      // 상세내역 확인
      await this.click(nergetLocator.usimSignCheckBtn[this.uiType]);
      await this.checkText(nergetLocator.signApplyPlanName[this.uiType], planName);
      await this.checkPositiveNumber(nergetLocator.signApplyPayment[this.uiType]);

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
      await this.checkURL(urlLocator.usim_detail[this.platform]);
      await this.checkCommonModals();

      // 유심카드 소지 여부
      await this.click(nergetLocator.usimCard[this.uiType], false);
      // 가입 유형
      await this.click(nergetLocator.usimSignType[this.uiType], false);
      // 가입 방법
      await this.click(nergetLocator.usimSignWay[this.uiType], false);
      // 기기 선택
      await this.click(nergetLocator.planSelectPhone[this.uiType], false);
      // 요금제
      await this.click(nergetLocator.usimSignPlan[this.uiType], false);
      // 할인 방법
      await this.click(nergetLocator.usimSignDiscount[this.uiType], false);
      // VIP 멤버십 혜택
      await this.click(nergetLocator.usimMembershipBenefit[this.uiType], false);
      // 너겟 특별한 혜택
      await this.click(nergetLocator.usimNergetCoupon[this.uiType], false);
      // 상세내역 확인
      await this.click(nergetLocator.usimSignCheckBtn[this.uiType]);
      // 월 납부 금액
      await this.checkPositiveNumber(nergetLocator.signApplyPayment[this.uiType]);

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
