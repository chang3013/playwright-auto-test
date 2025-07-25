import { AppActions } from '@common/actions/AppActions.js';
import { TextConstants } from '@common/constants/TextConstants.js';
import { benefitLocator } from '@common/locators/benefitLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Browser } from 'webdriverio';

export class BenefitPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }

  async goBenefit(): Promise<void> {
    try {
      await this.goToHome();
      await this.isDelay();
      await this.waitAndClick(uiLocator.hamburger[this.uiType]);
      await this.waitAndClick(benefitLocator.benefitGnb);
      await this.waitAndClick(benefitLocator.benefitSub);
      await this.closeAnyModal([...uiLocator.modal_selector]);
      console.log('헤택/멤버십 서브메인 화면 이동');
    } catch (err) {
      console.log(err, '혜택/멤버십 서브메인 이동 실패');
    }
  }
  async goMembership(): Promise<void> {
    try {
      await this.goToHome();
      await this.isDelay();
      await this.waitAndClick(uiLocator.hamburger[this.uiType]);
      await this.waitAndClick(benefitLocator.benefitGnb);
      await this.waitAndClick(benefitLocator.benefitMemberBtn);
      await this.waitAndClick(benefitLocator.benefitMembership);
      await this.isDelay();
      console.log('멤버십 이용내역 화면 이동');
    } catch (err) {
      console.log(err, '멤버십 페이지 이동 실패');
    }
  }
  /**
   * 혜택-이벤트 확인
   */
  async benefitEvent(): Promise<boolean> {
    try {
      await this.goBenefit();
      await this.smoothScrollTo(benefitLocator.eventSection);
      console.log(await this.elFindCount(benefitLocator.eventImg[this.uiType]));
      await this.waitAndClick(benefitLocator.eventAllBtn[this.uiType]);
      return await this.isCurrentUrlIncludes(benefitLocator.eventUrl);
    } catch (err) {
      console.log(err, '혜택 이벤트 요소 확인 실패');
      return false;
    }
  }
  async benefitKV(): Promise<boolean> {
    try {
      await this.goBenefit();
      await this.waitForPageLoad();

      return await this.imgCheck(benefitLocator.kvImg[this.uiType]);
    } catch (err) {
      console.log(err, 'KV 이미지 요소 확인 실패');
      return false;
    }
  }
  async benefitCategoryCheck(): Promise<boolean> {
    try {
      await this.isDelay;

      return await this.textCheck(
        benefitLocator.banner[this.uiType],
        TextConstants.BENEFIT_THEMA_BANNER,
      );
    } catch (err) {
      console.log(err, '혜택 카테고리 텍스트 확인 실패');
      return false;
    }
  }
  async benefitPartnerCheck(): Promise<boolean> {
    try {
      await this.isDelay;
      await this.smoothScrollTo(benefitLocator.iosBenefit);
      return await this.textCheck(
        benefitLocator.iosBenefit,
        TextConstants.BENEFIT_MEMBERSHIP_BENEFIT,
      );
    } catch (err) {
      console.log(err, '제휴사 컨텐츠 텍스트 확인 실패');
      return false;
    }
  }
  async benefitPartnerAllUrl(): Promise<boolean> {
    try {
      await this.isDelay;
      await this.waitAndClick(benefitLocator.iosPartnerAllBtn);
      return await this.isCurrentUrlIncludes(benefitLocator.partnerUrl);
    } catch (err) {
      console.log(err, '제휴사 컨텐츠 텍스트 확인 실패');
      return false;
    }
  }
  async membershipCheck(): Promise<boolean> {
    try {
      await this.goMembership();

      return await this.isElementCheck(benefitLocator.membershipInfo[this.uiType]);
    } catch (err) {
      console.log(err, '멤버십 정보 확인 실패');
      return false;
    }
  }
  async membershipTabCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      return await this.textCheck(
        benefitLocator.membershipTab[this.uiType],
        TextConstants.MEMBERSHIP_TAB,
      );
    } catch (err) {
      console.log(err, '멤버십 정보 확인 실패');
      return false;
    }
  }
  async membershipUseListCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.smoothScrollTo(benefitLocator.membershipUseSection);
      return await this.textCheck(
        benefitLocator.membershipContent[this.uiType],
        TextConstants.IOS_MEMBERSHIP_USE,
      );
    } catch (err) {
      console.log(err, '멤버십 이용내역 요소 확인 실패');
      return false;
    }
  }
  async membershipChangeCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.waitAndClick(benefitLocator.iosMembershipTabChange);

      return await this.textCheck(
        benefitLocator.membershipContent[this.uiType],
        TextConstants.MEMBERSHIP_CHANGE,
      );
    } catch (err) {
      console.log(err, '멤버십 변경내역 확인 실패');
      return false;
    }
  }
}
