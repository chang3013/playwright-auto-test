import { AppActions } from '@common/actions/AppActions.js';
import { mobileCartLocator } from '@common/locators/mobileCartLocator.js';
import { mobileLocator } from '@common/locators/mobileLocator.js';
import { mobilePlanLocator } from '@common/locators/mobilePlanLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { join } from 'path';
import type { Browser } from 'webdriverio';

import { TextConstants } from '../../../../common/constants/TextConstants.js';

export class MobilePage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }

  /**
   *  모바일 서브메인 휴대폰 랜덤 선택
   */
  async selectRandomPhoneSelect(): Promise<boolean> {
    try {
      const tabElements = await this.driver.$$(mobileLocator.phoneTabList[this.uiType]);
      const btnElements = await this.driver.$$(mobileLocator.phoneOrderBtn[this.uiType]);
      const phoneNameElements = await this.driver.$$(mobileLocator.phoneName[this.uiType]);

      const tabIndex = Math.floor(Math.random() * (await tabElements.length));
      const tab = tabElements[tabIndex];
      await tab.click();
      console.log('탭 인덱스:', tabIndex);

      const startIdx = tabIndex * 8;
      const phoneBtnIndex = startIdx + Math.floor(Math.random() * 8);
      const phoneBtn = btnElements[phoneBtnIndex];
      console.log('선택한 디바이스 인덱스', phoneBtnIndex);
      const phoneBtnLocal = (await phoneBtnIndex) % 8;
      console.log('로컬인덱스 : ', phoneBtnLocal);
      const phoneSwipeList = await this.driver.$$(mobileLocator.mobilePhone);
      const phoneWrapper = await phoneSwipeList[tabIndex];
      await this.isDelay();
      await this.scrollSlideIntoView(phoneWrapper, phoneBtnLocal);
      await this.isDelay();
      const targetPhoneName = await phoneNameElements[phoneBtnIndex];
      const phoneNameText = await targetPhoneName.getText();

      console.log(phoneNameText);

      await this.driver.execute(
        (el: HTMLElement) => el.click(),
        phoneBtn as unknown as HTMLElement,
      );
      await this.isDelay();
      const selectDeviceName = (await this.getInnerText(
        mobileLocator.iosDetailPhoneName,
      )) as string;

      return await this.isTextContains(selectDeviceName, phoneNameText);
    } catch (err) {
      console.log(err, '휴대폰 디바이스 랜덤 선택 실패');
      return false;
    }
  }
  /**
   * 모바일 서브메인 태블릿/스마트워치 랜덤 선택
   */
  async randomDeviceSelect(): Promise<boolean> {
    try {
      //탭 랜덤 선택 및 탭인덱스 추출
      const tablist = await this.driver.$$(mobileLocator.deviceTabList[this.uiType]);
      const orderBtn = await this.driver.$$(mobileLocator.deviceOrderBtn[this.uiType]);
      const deviceNameList = await this.driver.$$(mobileLocator.deviceName[this.uiType]);
      const tabIndex = Math.floor(Math.random() * (await tablist.length));
      const tab = tablist[tabIndex];
      await tab.click();
      console.log('탭 인덱스:', tabIndex);

      //추출된 탭 인덱스에 속한 기기 선택
      const startIdx = tabIndex * 4;
      const deviceBtnIndex = startIdx + Math.floor(Math.random() * 4);
      const deviceBtn = orderBtn[deviceBtnIndex];
      console.log('선택한 디바이스 인덱스', deviceBtnIndex);
      const deviceBtnLocal = (await deviceBtnIndex) % 4;
      console.log('로컬인덱스 : ', deviceBtnLocal);
      const deviceSwipeList = await this.driver.$$(mobileLocator.mobileDevice);
      const deviceWrapper = await deviceSwipeList[tabIndex];
      await this.isDelay();
      await this.scrollSlideIntoView(deviceWrapper, deviceBtnLocal);
      await this.isDelay();
      const targetDeviceName = await deviceNameList[deviceBtnIndex];
      const deviceNameText = await targetDeviceName.getText();
      console.log(deviceNameText);
      await this.driver.execute(
        (el: HTMLElement) => el.click(),
        deviceBtn as unknown as HTMLElement,
      );
      await this.isDelay();
      const selectDeviceName = (await this.getInnerText(
        mobileLocator.iosDetailDeviceName,
      )) as string;

      return await this.isTextContains(selectDeviceName, deviceNameText);
    } catch (err) {
      console.log(err, '랜덤 디바이스 선택 실패');
      return false;
    }
  }
  /**
   *  모바일 서브메인 페이지 이동
   */
  async goToMobileSubMain(): Promise<void> {
    try {
      await this.goToHome();
      await this.waitAndClick(uiLocator.hamburger[this.uiType]);
      await this.waitAndClick(mobileLocator.mobileGnb);
      await this.waitAndClick(mobileLocator.mobileSub);
    } catch (err) {
      console.log(err, '모바일 서브메인 이동 실패');
    }
  }
  /**
   *  모바일 서브메인 키비주얼 확인
   */
  async subMainKVCheck(): Promise<boolean> {
    try {
      // KV
      await this.goToMobileSubMain();
      await this.isDelay();
      await this.waitForPageLoad();
      return await this.imgCheck(mobileLocator.iosKvImg);
    } catch (err) {
      console.error('모바일 서브메인 키비주얼 요소 확인 실패', err);
      return false;
    }
  }
  /**
   *  모바일 서브메인 테마베너 확인
   */
  async subMainCategoryCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      return await this.textCheck(mobileLocator.iosBanner, TextConstants.MOBILE_THEMA_BANNER);
    } catch (err) {
      console.log('모바일 서브메인 키비주얼 요소 확인 실패', err);
      return false;
    }
  }
  /**
   *  모바일 서브메인 이벤트 확인
   */
  async subMainEventCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.smoothScrollTo(mobileLocator.eventTitle[this.uiType]);
      await this.imgCheck(mobileLocator.eventImg[this.uiType]);
      await this.waitAndClick(mobileLocator.eventAllBtn[this.uiType]);
      return await this.isCurrentUrlIncludes(mobileLocator.eventUrl);
    } catch (err) {
      console.log('모바일 서브메인 이벤트 이미지 요소/이벤트 페이지 이동 확인 실패');
      return false;
    }
  }
  /**
   *  모바일 서브메인 휴대폰 확인
   */
  async subMainPhoneCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.goToMobileSubMain();
      await this.smoothScrollTo(mobileLocator.phoneSection);
      //탭리스트 확인 후 랜덤 선택
      return await this.selectRandomPhoneSelect();
    } catch (err) {
      console.log(err, '모바일 서브메인 휴대폰 디바이스 요소 확인 실패');
      return false;
    }
  }
  /**
   *  모바일 서브메인 요금제 확인
   */
  async subMainPlanCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.goToMobileSubMain();
      await this.smoothScrollTo(mobileLocator.planSection);
      await this.swipeToEnd(mobileLocator.planSwipe);
      await this.waitAndClick(mobileLocator.planMoreButton);
      await this.isDelay();
      return this.isCurrentUrlIncludes(mobileLocator.subMainPlanUrl);
    } catch (err) {
      console.log(err, '모바일 서브메인 휴대폰 디바이스 요소 확인 실패');
      return false;
    }
  }
  /**
   *  모바일 서브메인 2nd 기기(태블릿/워치) 확인
   */
  async subMainDeviceCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.goToMobileSubMain();
      await this.smoothScrollTo(mobileLocator.deviceSection);
      await this.isDelay();
      return await this.randomDeviceSelect();
    } catch (err) {
      console.log(err, '모바일 서브메인 휴대폰 디바이스 요소 확인 실패');
      return false;
    }
  }
  /**
   *  모바일 서브메인 서브메뉴 확인
   */
  async subMenuCheck(): Promise<boolean> {
    try {
      await this.isDelay();
      await this.goToMobileSubMain();
      await this.smoothScrollTo(mobileLocator.subMenu[this.uiType]);
      await this.clickAllTabsSequentially(mobileLocator.subMenuTabList[this.uiType]);
      await this.isDelay();
      return true;
    } catch (err) {
      console.log(err, '모바일 서브메인 휴대폰 디바이스 요소 확인 실패');
      return false;
    }
  }

  // 모바일 > 모바일 기기 > 휴대폰 랜덤 디바이스 선택하여 장바구니 추가 / 삭제
  //---------------------------------------------------------------------------------
  //

  /**
   *  모바일 > 모바일 기기 > 휴대폰 이동
   */
  async goToMobilePhone(): Promise<void> {
    try {
      await this.isDelay();
      await this.goToHome();
      await this.waitAndClick(uiLocator.hamburger[this.uiType]);
      await this.waitAndClick(mobileCartLocator.mobileGnb);
      await this.waitAndClick(mobileCartLocator.mobileSub);
      await this.waitAndClick(mobileCartLocator.mobileDevice);
      await this.isDelay();
      await this.closeAnyModal([...uiLocator.modal_selector]);
    } catch (err) {
      console.log(err, '모바일 > 모바일기기 > 휴대폰 이동 실패');
    }
  }
  /**
   *  모바일 > 모바일 기기 > 휴대폰 에서 랜덤하게 디바이스 선택후 신청하기 버튼 클릭 하는 로직
   */
  async targetDevice(): Promise<void> {
    const deviceList = await this.driver.$$(mobileCartLocator.deviceList);

    if ((await deviceList.length) === 0) {
      throw new Error('디바이스 목록이 비어 있습니다.');
    }

    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
      const randomIndex = Math.floor(Math.random() * (await deviceList.length));
      const targetDevice = deviceList[randomIndex];

      // 스크롤 이동
      await this.driver.execute(
        (el: HTMLElement) => el.scrollIntoView({ block: 'center', behavior: 'auto' }),
        targetDevice as unknown as HTMLElement,
      );

      // 버튼 span 텍스트 확인
      const applyBtn = await targetDevice.$('button.user-action-btn.point-color');
      const span = await applyBtn.$('span');
      const text = await span.getText();

      if (text.includes('신청')) {
        await applyBtn.click();
        await this.waitForPageLoad();
        await this.closeAnyModal([...uiLocator.modal_selector]);
        return;
      }

      retries++;
    }

    throw new Error(`'신청' 버튼이 포함된 디바이스를 ${maxRetries}회 시도 내에 찾지 못했습니다.`);
  }
  /**
   *  모바일 > 모바일 기기 > 디바이스 상세 이동 체크
   */
  async deviceSelectCheck(): Promise<boolean> {
    try {
      await this.goToMobilePhone();
      await this.isDelay();
      await this.targetDevice();
      await this.isDelay();
      await this.closeAnyModal([...uiLocator.modal_selector]);
      return this.isCurrentUrlIncludes(mobileCartLocator.detailUrl);
    } catch (err) {
      console.log(err, '모바일 > 모바일기기 > 휴대폰 이동 실패');
      return false;
    }
  }
  /**
   *  디바이스 상세에서 장바구니 추가
   */
  async addToCartCheck(): Promise<boolean> {
    try {
      console.log('선택한 디바이스 장바구니 담기 실행');
      await this.isDelay();
      await this.smoothScrollTo(mobileCartLocator.signTypeSection);
      await this.isDelay();
      //가입 유형 선택
      await this.iosClick(mobileCartLocator.signType[this.uiType]);
      await this.isDelay();
      // 요금제 선택
      await this.iosClick(mobileCartLocator.plan[this.uiType]);
      await this.isDelay();
      // 요금제 특별 혜택
      try {
        await this.iosClick(mobileCartLocator.iosBenefit);
        await this.isDelay();
      } catch {
        console.log('추가혜택 요소 없음 SKIP');
      }

      // 할인방법
      await this.iosClick(mobileCartLocator.discount[this.uiType]);
      await this.isDelay();
      // 결제방식(할부)
      await this.iosClick(mobileCartLocator.iosMonthlyPayment);
      await this.isDelay();
      // 배송
      await this.iosClick(mobileCartLocator.iosDelivery);
      await this.isDelay();

      //혜택 요소 확인 후 진행
      try {
        await this.iosClick(mobileCartLocator.iosBenefit2);
        await this.isDelay();
      } catch {
        console.log('추가혜택 요소 없음 SKIP');
      }

      await this.isDelay();
      await this.iosClick(mobileCartLocator.iosGift);
      await this.isDelay();
      await this.iosClick(mobileCartLocator.iosGift2);
      await this.isDelay();
      await this.iosClick(mobileCartLocator.partnerCard[this.uiType]);
      await this.isDelay();
      await this.iosClick(mobileCartLocator.moreBenefit[this.uiType]);
      await this.isDelay();
      await this.iosClick(mobileCartLocator.cartBtn[this.uiType]);
      await this.isDelay();
      await this.iosClick(mobileCartLocator.moveCartBtn[this.uiType]);
      await this.isDelay();
      return await this.isCurrentUrlIncludes(mobileCartLocator.cartUrl);
    } catch (err) {
      console.log(err, '장바구니 담기 실패');
      return false;
    }
  }
  /**
   *  장바구니 > 삭제
   */
  async deleteCartCheck(): Promise<boolean> {
    try {
      console.log('장바구니 담은 상품 삭제 케이스 진행');
      await this.isDelay();
      const deviceName = await this.getInnerText(mobileCartLocator.cartName[this.uiType]);
      const devicePrice = await this.getInnerText(mobileCartLocator.cartPrice[this.uiType]);
      console.log(deviceName, devicePrice);

      await this.iosClick(mobileCartLocator.btnDel[this.uiType]);
      const delMessageElement = await this.driver.$(mobileCartLocator.delMessage);
      const delMessage = await delMessageElement.getText();
      console.log(delMessage);
      await this.isDelay();
      await this.waitAndClick(mobileCartLocator.okBtn);
      const delSummitElement = await this.driver.$(mobileCartLocator.delMessage);
      const delSummitMessage = await delSummitElement.getText();
      console.log(delSummitMessage);
      await this.isDelay();
      await this.waitAndClick(mobileCartLocator.delSummitBtn);
      await this.isDelay();
      return true;
    } catch (err) {
      console.log(err, '장바구니 디바이스 삭제 실패');
      return false;
    }
  }
  // 모바일 > 모바일 요금제 확인 케이스
  //---------------------------------------------------------------------------------
  //
  /**
   *  모바일 요금제 > 5G/LTE 페이지 이동
   */
  async goMobilePlan(): Promise<void> {
    try {
      await this.goToHome();
      await this.isDelay();
      await this.waitAndClick(uiLocator.hamburger[this.uiType]);
      await this.waitAndClick(mobilePlanLocator.mobileGnb);
      await this.waitAndClick(mobilePlanLocator.mobilePlan);
      await this.waitAndClick(mobilePlanLocator.mobile5G_LTE);
      await this.isDelay();
      await this.closeAnyModal([...uiLocator.modal_selector]);
    } catch (err) {
      console.log(err, '모바일 > 모바일요금제 > 5G/LTE 이동 실패');
    }
  }
  /**
   *  모바일 요금제 내요금제 정보와 탭리스트 확인
   */
  async mobilePlanCheck(): Promise<boolean> {
    try {
      await this.goMobilePlan();
      const myPlanName = await this.getInnerText(mobilePlanLocator.myPlanName[this.uiType]);
      const myPlanPrice = await this.getInnerText(mobilePlanLocator.myPlanPrice[this.uiType]);
      console.log('내 요금제 : ', myPlanName);
      console.log('내 월 요금 : ', myPlanPrice);
      // Tablist 요소 확인

      return await this.textCheck(mobilePlanLocator.iosTabList, TextConstants.MOBILE_PLAN_TAB);
    } catch (err) {
      console.log(err, '모바일 요금제 요소 확인 실패');
      return false;
    }
  }
  /**
   *  요금제 비교하기
   */
  async comparePlanCheck(): Promise<boolean> {
    try {
      const planLists = await this.driver.$$(mobilePlanLocator.planListClass);
      const randomIndex = Math.floor(Math.random() * (await planLists.length));

      const targetPlan = await planLists[randomIndex];
      console.log(randomIndex);
      //대상 요금제로 강제 스크롤
      await this.driver.execute(
        (el: HTMLElement) => el.scrollIntoView({ block: 'center', behavior: 'auto' }),
        targetPlan as unknown as HTMLElement,
      );
      await this.isDelay();

      const planName = await targetPlan.$('.tit1');
      const planPrice = await targetPlan.$('.txt_price1 strong');
      const planVersus = await targetPlan.$('.c-btn-group button:nth-of-type(1)');
      const planNameTxt = await planName.getText();
      const planPriceTxt = await planPrice.getText();
      console.log(planNameTxt);
      console.log(planPriceTxt);

      //비교하기
      await planVersus.click();
      await this.isDelay();

      const compareName = await this.getAllInnerTexts(
        mobilePlanLocator.comparePagePlanName[this.uiType],
      );
      const comparePrice = await this.getAllInnerTexts(
        mobilePlanLocator.comparePagePlanPrice[this.uiType],
      );
      console.log(compareName);
      console.log(comparePrice);
      return await this.isCurrentUrlIncludes(mobilePlanLocator.compareUrl);
    } catch (err) {
      console.log(err, '모바일 요금제 요소 확인 실패');
      return false;
    }
  }
  /**
   *  모바일 요금제 변경하기
   */
  async changPlanCheck(): Promise<boolean> {
    try {
      await this.goMobilePlan();
      await this.isDelay();
      const planList = await this.driver.$$(mobilePlanLocator.planListClass);
      const randomIndex = Math.floor(Math.random() * (await planList.length));
      const TargetPlan = await planList[randomIndex];

      await this.driver.execute(
        (el: HTMLElement) => el.scrollIntoView({ block: 'center', behavior: 'auto' }),
        TargetPlan as unknown as HTMLElement,
      );
      const planName = await TargetPlan.$('.tit1');
      console.log(planName, '선택한 요금제 이름');
      const planChange = await TargetPlan.$('.c-btn-group button:nth-of-type(2)');
      await planChange.click();
      await this.isDelay();
      try {
        console.log('프리미엄혜택 있으면 클릭 없으면 패스');
        await this.isDelay();
        await this.waitAndClick(mobilePlanLocator.firstBenefit);
        await this.isDelay();
        await this.iosClick(mobilePlanLocator.benefitNextBtn[this.uiType]);
        await this.isDelay();
        await this.waitAndClick(mobilePlanLocator.secondBenefit);
        await this.isDelay();
        await this.iosClick(mobilePlanLocator.benefitNextBtn[this.uiType]);
        await this.isDelay();
      } catch {
        console.log('모달 없음, 패스');
      }
      const planNameRow = await this.getInnerText(mobilePlanLocator.planNameRow[this.uiType]);
      const myPrice = await this.getInnerText(mobilePlanLocator.nowPrice[this.uiType]);
      const changePrice = await this.getInnerText(mobilePlanLocator.changePrice[this.uiType]);
      console.log('요금제 변경 내역 : ', planNameRow);
      console.log('현재 월요금 : ', myPrice);
      console.log('변경할 월요금 : ', changePrice);
      return true;
    } catch (err) {
      console.log(err, '모바일 요금제 요소 확인 실패');
      return false;
    }
  }
}
