import { AppActions } from '@common/actions/AppActions.js';
import { nergetLocator } from '@common/locators/nergetLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Browser } from 'webdriverio';

export class NergetPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }

  async goNerget(): Promise<void> {
    await this.goToHome();
    await this.waitAndClick(nergetLocator.hamburger);
    await this.waitAndClick(nergetLocator.nergetGnb);
    await this.waitAndClick(nergetLocator.nergetSubMain);
    await this.waitForPageLoad();
    await this.closeAnyModal([...uiLocator.modal_selector]);
  }

  async usimJoinCase(): Promise<boolean> {
    try {
      await this.goNerget();
      await this.waitAndClick(nergetLocator.usimSignBtn[this.uiType]);
      await this.waitForPageLoad();
      //유심카드가 있나요?
      await this.iosClick(nergetLocator.usimCard[this.uiType]);
      await this.closeAnyModal([...uiLocator.modal_selector]);
      //가입유형
      await this.iosClick(nergetLocator.usimSignType[this.uiType]);
      await this.closeAnyModal([...uiLocator.modal_selector]);
      //가입방법
      await this.iosClick(nergetLocator.usimSignWay[this.uiType]);
      await this.closeAnyModal([...uiLocator.modal_selector]);
      //요금제선택
      await this.iosClick(nergetLocator.usimSignPlan[this.uiType]);
      //할인방법
      await this.iosClick(nergetLocator.usimSignDiscount[this.uiType]);
      //VIP멤버십 혜택
      await this.iosClick(nergetLocator.usimNergetVIP);
      //너겟만을 위한 특별한 혜택
      await this.iosClick(nergetLocator.usimNergetBenetfit);
      const planPayment = await this.getInnerText(nergetLocator.usimPayment[this.uiType]);

      //상세내역 확인
      await this.iosClick(nergetLocator.usimSignCheckBtn[this.uiType]);
      await this.isDelay();
      //월 납부금액 비교
      const applyPayment = await this.getInnerText(nergetLocator.signApplyPayment[this.uiType]);
      console.log(planPayment, applyPayment);

      return await this.isTextEqual(planPayment, applyPayment);
    } catch (err) {
      console.log(err, '너겟 유심 가입 신청서 확인 실패');
      return false;
    }
  }
  //너겟페이지, 너겟 소개배너
  async nergetInfoCheck(): Promise<boolean> {
    try {
      await this.goNerget();
      await this.smoothScrollTo(nergetLocator.nergetUsim);
      return await this.isElementCheck(nergetLocator.nergetUsimView);
    } catch (err) {
      console.log(err, '너겟 소개 영역 요소 확인 실패');
      return false;
    }
  }
  //너겟 요금제
  async nergetPlanCheck(): Promise<boolean> {
    try {
      await this.smoothScrollTo(nergetLocator.nergetUsimPlan);
      // await this.swipeToEnd(nergetLocator.nergetPlanSlide); // 스와이프 동작 추후 확인
      await this.lastEltoClick(nergetLocator.nergetUsimPlanJoin);
      await this.isDelay();
      return await this.isCurrentUrlIncludes(nergetLocator.nergetUsimJoinUrl);
    } catch (err) {
      console.log(err, '너겟요금제 체크');
      return false;
    }
  }
  //너겟 요금제 전체보기
  async nergetPlanAll(): Promise<boolean> {
    try {
      await this.goNerget();
      await this.smoothScrollTo(nergetLocator.nergetUsimPlanJoin);
      await this.focusToClick(nergetLocator.planAllBtn[this.uiType]);
      await this.isDelay();
      return await this.isCurrentUrlIncludes(nergetLocator.nergetPlanUrl);
    } catch (err) {
      console.log(err, '너겟 요금제 전체보기 이동 확인 실패');
      return false;
    }
  }
  //너겟 요금제 혜택리스트
  async nergetBenefitCheck(): Promise<boolean> {
    try {
      await this.goNerget();
      await this.smoothScrollTo(nergetLocator.iosBenefit);
      return await this.elFind(nergetLocator.iosBenefit);
    } catch (err) {
      console.log(err, '너겟 혜택 요소 확인 실패');
      return false;
    }
  }
  //너겟 리뷰리스트
  async nergetReviewCheck(): Promise<boolean> {
    try {
      await this.smoothScrollTo(nergetLocator.nergetReview);
      await this.waitAndClick(nergetLocator.nergetReviewMore);
      return await this.elFind(nergetLocator.review[this.uiType]);
    } catch (err) {
      console.log(err, '너겟 리뷰 리스트 요소 확인 실패');
      return false;
    }
  }
  //너겟 이벤트 리스트
  async nergetEventCheck(): Promise<boolean> {
    try {
      await this.smoothScrollTo(nergetLocator.nergetEvent);
      await this.elFindCount(nergetLocator.event[this.uiType]);
      await this.waitAndClick(nergetLocator.nergetEventMore);
      await this.isDelay();
      return await this.isCurrentUrlIncludes(nergetLocator.nergetEventUrl);
    } catch (err) {
      console.log(err, '너겟 이벤트 리스트 요소 확인 실패');
      return false;
    }
  }
}
