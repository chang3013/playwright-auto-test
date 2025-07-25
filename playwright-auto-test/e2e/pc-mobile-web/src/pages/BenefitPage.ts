import { WebActions } from '@common/actions/WebActions.js';
import { TextConstants } from '@common/constants/TextConstants.js';
import { benefitLocator } from '@common/locators/benefitLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';

export class BenefitPage extends WebActions {
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super(page);
  }

  // -------------------------------------------------------------------- //
  // 혜택/멤버십 서브메인
  async keyVisualImageCheck(): Promise<boolean> {
    try {
      // KV
      await this.checkImg(benefitLocator.kvImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[keyVisualImageCheck Failed]', err);
      return false;
    }
  }

  async themaBannerTextCheck(): Promise<boolean> {
    try {
      // 테마배너
      await this.checkText(benefitLocator.banner[this.uiType], TextConstants.BENEFIT_THEMA_BANNER);
      return true;
    } catch (err) {
      console.error('[themaBannerTextCheck Failed]', err);
      return false;
    }
  }

  async membershipBenefitSectionCheck(): Promise<boolean> {
    try {
      // 멤버십 혜택
      await this.checkText(benefitLocator.benefit[this.uiType], TextConstants.BENEFIT_MEMBERSHIP_BENEFIT);
      // 전체보기
      await this.click(benefitLocator.partnerAllBtn[this.uiType]);
      await this.checkURL(urlLocator.benefit_membership[this.platform]);
      await this.gotoURL(urlLocator.benefit[this.platform]);
      return true;
    } catch (err) {
      console.error('[membershipBenefitSectionCheck Failed]', err);
      return false;
    }
  }

  async onlineSignBenefitSectionCheck(): Promise<boolean> {
    try {
      // 온라인 가입 할인 혜택
      await this.checkImg(benefitLocator.onlineBenefitImg[this.uiType]);
      // 전체보기
      await this.click(benefitLocator.onlineBenefitAllBtn[this.uiType]);
      await this.checkURL(urlLocator.online_benefit[this.platform]);
      await this.gotoURL(urlLocator.benefit[this.platform]);
      return true;
    } catch (err) {
      console.error('[onlineSignBenefitSectionCheck Failed]', err);
      return false;
    }
  }

  async eventSectionCheck(): Promise<boolean> {
    try {
      // 이벤트
      await this.checkImg(benefitLocator.eventImg[this.uiType]);
      // 전체보기
      await this.click(benefitLocator.eventAllBtn[this.uiType]);
      await this.checkURL(urlLocator.benefit_event[this.platform]);
      await this.gotoURL(urlLocator.benefit[this.platform]);
      return true;
    } catch (err) {
      console.error('[eventSectionCheck Failed]', err);
      return false;
    }
  }

  // -------------------------------------------------------------------- //
  // 멤버십 이용내역

  async membershipInfoTextCheck(): Promise<boolean> {
    try {
      // 멤버십 정보
      await this.checkText(benefitLocator.membershipInfo[this.uiType], TextConstants.MEMBERSHIP_INFO);
      return true;
    } catch (err) {
      console.error('[membershipInfoTextCheck Failed]', err);
      return false;
    }
  }

  async membershipTabTextCheck(): Promise<boolean> {
    try {
      // 탭
      await this.checkText(benefitLocator.membershipTab[this.uiType], TextConstants.MEMBERSHIP_TAB);
      return true;
    } catch (err) {
      console.error('[membershipInfoCheck Failed]', err);
      return false;
    }
  }

  async membershipUsageSectionCheck(): Promise<boolean> {
    try {
      // 멤버십 이용내역
      await this.checkText(benefitLocator.membershipContent[this.uiType], TextConstants.MEMBERSHIP_USE);
      // 검색 버튼
      await this.click(benefitLocator.membershipUseSearchBtn[this.uiType]);
      await this.checkVisible(benefitLocator.membershipUseSearchInfo[this.uiType]);
      return true;
    } catch (err) {
      console.error('[membershipUsageSectionCheck Failed]', err);
      return false;
    }
  }

  async membershipChangeSectionCheck(): Promise<boolean> {
    try {
      // 멤버십 변경내역
      await this.click(benefitLocator.membershipTabChange[this.uiType]);
      await this.checkText(benefitLocator.membershipContent[this.uiType], TextConstants.MEMBERSHIP_CHANGE);
      return true;
    } catch (err) {
      console.error('[membershipChangeSectionCheck Failed]', err);
      return false;
    }
  }
}
