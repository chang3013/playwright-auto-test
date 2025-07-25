import { AppActions } from '@common/actions/AppActions.js';
import { mobilePlanLocator } from '@common/locators/mobilePlanLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Browser } from 'webdriverio';





export class MobilePlanPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }

  async mobilePlanCase(): Promise<boolean> {
    try {
      await this.goToHome();
      await this.driver.pause(1000);
      await this.goMobilePlan();
      await this.iosClick(mobilePlanLocator.myInfoDropDown[this.uiType]);
      const myPlanName = await this.getInnerText(mobilePlanLocator.myPlanName[this.uiType]);
      const myPlanPrice = await this.getInnerText(mobilePlanLocator.myPlanPrice[this.uiType]);
      console.log('내 요금제 : ', myPlanName);
      console.log('내 월 요금 : ', myPlanPrice);

      const tabListName = await this.getAllInnerTexts(mobilePlanLocator.iosTabList);
      const cleanTabList = tabListName[0].split('\n').map(text => text.trim());
      console.log('모바일 요금제 탭 리스트 : ', cleanTabList);
      //‼️‼️‼️ 케이스 결과 처리 하여 Steps에 결과처리 필요 ‼️‼️‼️
      const planList = await this.driver.$$(mobilePlanLocator.planListClass);
      const planListCount = await planList.length;
      console.log('리스트 개수 : ', planListCount);
      //요금제 비교, 변경 확인
      await this.targetPlan();
      return true;
    } catch (err) {
      console.log('메인메뉴 > 유독 메뉴 이동 실패', err);
      return false;
    }
  }
  async goMobilePlan(): Promise<void> {
    await this.waitAndClick(uiLocator.hamburger[this.uiType]);
    await this.waitAndClick(mobilePlanLocator.mobileGnb);
    await this.waitAndClick(mobilePlanLocator.mobilePlan);
    await this.waitAndClick(mobilePlanLocator.mobile5G_LTE);
    await this.driver.pause(800);
  }
  async targetPlan(): Promise<void> {
    const planLists = await this.driver.$$(mobilePlanLocator.planListClass);
    const randomIndex = Math.floor(Math.random() * (await planLists.length));

    const targetPlan = await planLists[randomIndex];
    console.log(randomIndex);
    //대상 요금제로 강제 스크롤
    await this.driver.execute(
      (el: HTMLElement) => el.scrollIntoView({ block: 'center', behavior: 'auto' }),
      targetPlan as unknown as HTMLElement,
    );
    await this.driver.pause(1000);

    const planName = await targetPlan.$('.tit1');
    const planPrice = await targetPlan.$('.txt_price1 strong');
    const planVersus = await targetPlan.$('.c-btn-group button:nth-of-type(1)');
    const planNameTxt = await planName.getText();
    const planPriceTxt = await planPrice.getText();
    console.log(planNameTxt);
    console.log(planPriceTxt);

    //비교하기
    await planVersus.click();
    await this.waitForPageLoad();
    await this.driver.pause(1000);
    const compareName = await this.getAllInnerTexts(
      mobilePlanLocator.comparePagePlanName[this.uiType],
    );
    const comparePrice = await this.getAllInnerTexts(
      mobilePlanLocator.comparePagePlanPrice[this.uiType],
    );
    console.log(compareName);
    console.log(comparePrice);
    await this.waitAndClick(mobilePlanLocator.backBtn);
    await this.driver.pause(1000);
    await this.waitForPageLoad();

    //Dom 정보 다시 수집
    const refreshPlanList = await this.driver.$$(mobilePlanLocator.planListClass);
    const refreshTargetPlan = await refreshPlanList[randomIndex];

    await this.driver.execute(
      (el: HTMLElement) => el.scrollIntoView({ block: 'center', behavior: 'auto' }),
      refreshTargetPlan as unknown as HTMLElement,
    );
    const planChange = await refreshTargetPlan.$('.c-btn-group button:nth-of-type(2)');
    await planChange.click();
    try {
      await this.driver.pause(2000);
      const modalContent = await this.isElementPresent('c-body-content');
      console.log(modalContent);
      if (modalContent) {
        console.log('프리미엄 혜택 리스트 선택 진행');
        await this.waitAndClick(mobilePlanLocator.firstBenefit);
        await this.driver.pause(1000);
        await this.waitAndClick(mobilePlanLocator.benefitNextBtn[this.uiType]);
        await this.driver.pause(2000);
        await this.waitAndClick(mobilePlanLocator.secondBenefit);
        await this.driver.pause(1000);
        await this.waitAndClick(mobilePlanLocator.benefitNextBtn[this.uiType]);
        await this.driver.pause(2000);
      }
    } catch {
      console.log('모달 없음, 패스');
    }
    const changePlanName = await this.getInnerText(mobilePlanLocator.planNameRow[this.uiType]);
    const myPrice = await this.getInnerText(mobilePlanLocator.nowPrice[this.uiType]);
    const changePrice = await this.getInnerText(mobilePlanLocator.changePrice[this.uiType]);
    console.log('요금제 변경 내역 : ', changePlanName);
    console.log('현재 월요금 : ', myPrice);
    console.log('현재 월요금 : ', changePrice);
  }
}
