import { WebActions } from '@common/actions/WebActions.js';
import { TextConstants } from '@common/constants/TextConstants.js';
import { mobileLocator } from '@common/locators/mobileLocator.js';
import { mobileCartLocator } from '@common/locators/mobileCartLocator.js';
import { mobilePlanLocator } from '@common/locators/mobilePlanLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class MobilePage extends WebActions {
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super(page);
  }

  // -------------------------------------------------------------------- //
  // 모바일 서브메인

  async keyVisualImageCheck(): Promise<boolean> {
    try {
      // KV
      await this.checkImg(mobileLocator.kvImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[keyVisualImageCheck Failed]', err);
      return false;
    }
  }

  async themaBannerSectionCheck(): Promise<boolean> {
    try {
      // 테마배너
      await this.checkText(mobileLocator.banner[this.uiType], TextConstants.MOBILE_THEMA_BANNER);

      const bannerList = await this.getLocator(mobileLocator.bannerLink[this.uiType]);
      const count = await bannerList.count();
      const num = this.getRandomInt(0, count-1);

      await this.click(bannerList.nth(num));

      const bannerHref: Record<number, string> = {
        0: urlLocator.phone[this.platform],  // 휴대폰
        1: urlLocator.plan[this.platform],  // 요금제
        2: urlLocator.usim_card[this.platform],  // 유심
        3: urlLocator.financing_model[this.platform],  // 모델별 지원금
        4: urlLocator.roaming[this.platform],  // 해외 로밍
        5: urlLocator.added_service[this.platform],  // 부가서비스
      };

      await this.checkURL(bannerHref[num]);
      await this.gotoURL(urlLocator.mobile[this.platform]);
      await this.checkCommonModals();
      return true;
    } catch (err) {
      console.error('[themaBannerSectionCheck Failed]', err);
      return false;
    }
  }

  async eventSectionCheck(): Promise<boolean> {
    try {
      // 이벤트
      await this.checkTitle(mobileLocator.eventTitle[this.uiType], "이벤트");
      await this.checkImg(mobileLocator.eventImg[this.uiType]);
      // 전체보기
      await this.click(mobileLocator.eventAllBtn[this.uiType]);
      await this.checkURL(urlLocator.benefit_event[this.platform]);
      await this.gotoURL(urlLocator.mobile[this.platform]);
      await this.checkCommonModals();
      return true;
    } catch (err) {
      console.error('[eventSectionCheck Failed]', err);
      return false;
    }
  }

  async phoneSectionCheck(): Promise<boolean> {
    try {
      // 휴대폰
      await this.scrollElementIntoView(mobileLocator.phoneTitle[this.uiType]);
      await this.checkTitle(mobileLocator.phoneTitle[this.uiType], "휴대폰");

      const phoneTabList = await this.getLocator(mobileLocator.phoneTabList[this.uiType]);

      const count = await phoneTabList.count();
      const num = this.getRandomInt(0, count-1);
      await this.click(phoneTabList.nth(num));

      const phoneImgList = await this.getLocator(mobileLocator.phoneImg[this.uiType]);
      const phonePriceList = await this.getLocator(mobileLocator.phonePrice[this.uiType]);
      const phoneNameList = await this.getLocator(mobileLocator.phoneName[this.uiType]);
      const phoneBtnList = await this.getLocator(mobileLocator.phoneOrderBtn[this.uiType]);

      const phoneTabListMap: Record<number, [number, number]> = {
        0: [0, 7],   // 추천
        1: [8, 15],   // 삼성
        2: [16, 23],  // Apple
        3: [24, 31], // 가성비폰
      };

      const [start, end] = phoneTabListMap[num];
      let num2 = this.getRandomInt(start, end);

      const phoneBtnText = await phoneBtnList.nth(num2).innerText();
      if (phoneBtnText !== '주문하기') {
        if (num2 === end) {
          num2 -= 1;
        } else {
          num2 += 1;
        }
      }

      await this.checkVisible(phoneImgList.nth(num2));
      await this.checkPositiveNumber(phonePriceList.nth(num2));

      const phoneName = await phoneNameList.nth(num2).innerText();

      await this.click(phoneBtnList.nth(num2));
      await this.checkURL(urlLocator.mobile_detail[this.platform]);

      const detailPhoneName = await this.getLocator(mobileLocator.detailPhoneName[this.uiType]).innerText();

      await expect(detailPhoneName).toContain(phoneName);

      await this.gotoURL(urlLocator.mobile[this.platform]);
      await this.checkCommonModals();
      // 전체보기
      await this.click(mobileLocator.phoneAllBtn[this.uiType]);
      await this.checkURL(urlLocator.phone[this.platform]);
      await this.gotoURL(urlLocator.mobile[this.platform]);
      await this.checkCommonModals();
      return true;
    } catch (err) {
      console.error('[phoneSectionCheck Failed]', err);
      return false;
    }
  }

  async recommendPlanSectionCheck(): Promise<boolean> {
    try {
      // 추천 요금제
      await this.checkTitle(mobileLocator.planTitle[this.uiType], "추천 요금제");

      const priceList = await this.getLocator(mobileLocator.planPrice[this.uiType]);
      const count = await priceList.count();
      for (let i = 0; i < count; i++) {
        await this.checkPositiveNumber(priceList.nth(i));
      }
      // 더보기
      await this.click(mobileLocator.planMoreBtn[this.uiType]);
      await this.checkURL(urlLocator.plan[this.platform]);
      await this.gotoURL(urlLocator.mobile[this.platform]);
      await this.checkCommonModals();
      return true;
    } catch (err) {
      console.error('[recommendPlanSectionCheck Failed]', err);
      return false;
    }
  }

  async deviceSectionCheck(): Promise<boolean> {
    try {
      // 태블릿/스마트워치
      await this.scrollElementIntoView(mobileLocator.deviceTitle[this.uiType]);
      await this.checkTitle(mobileLocator.deviceTitle[this.uiType], "태블릿/스마트워치");

      const deviceTabList = await this.getLocator(mobileLocator.deviceTabList[this.uiType]);

      const count = await deviceTabList.count();
      const num = this.getRandomInt(0, count-1);
      await this.click(deviceTabList.nth(num));

      const deviceImgList = await this.getLocator(mobileLocator.deviceImg[this.uiType]);
      const devicePriceList = await this.getLocator(mobileLocator.devicePrice[this.uiType]);
      const deviceNameList = await this.getLocator(mobileLocator.deviceName[this.uiType]);
      const deviceBtnList = await this.getLocator(mobileLocator.deviceOrderBtn[this.uiType]);

      const deviceTabListMap: Record<number, [number, number]> = {
        0: [0, 3],   // 추천
        1: [4, 7],   // 삼성
        2: [8, 11],  // Apple
      };

      const [start, end] = deviceTabListMap[num];
      let num2 = this.getRandomInt(start, end);

      const deviceBtnText = await deviceBtnList.nth(num2).innerText();
      if (deviceBtnText !== '주문하기') {
        if (num2 === end) {
          num2 -= 1;
        } else {
          num2 += 1;
        }
      }

      await this.checkVisible(deviceImgList.nth(num2));
      await this.checkPositiveNumber(devicePriceList.nth(num2));

      const deviceName = await deviceNameList.nth(num2).innerText();

      await this.click(deviceBtnList.nth(num2));
      await this.checkURL(urlLocator.mobile_detail[this.platform]);

      const detailDeviceName = await this.getLocator(mobileLocator.detailDeviceName[this.uiType]).innerText();

      await expect(detailDeviceName).toContain(deviceName);

      await this.gotoURL(urlLocator.mobile[this.platform]);
      await this.checkCommonModals();
      // 전체보기
      await this.click(mobileLocator.deviceAllBtn[this.uiType]);
      await this.checkURL(urlLocator.smart_device[this.platform]);
      await this.gotoURL(urlLocator.mobile[this.platform]);
      await this.checkCommonModals();
      return true;
    } catch (err) {
      console.error('[deviceSectionCheck Failed]', err);
      return false;
    }
  }

  async submenuSectionCheck(): Promise<boolean> {
    try {
      // 하위 메뉴
      await this.scrollElementIntoView(mobileLocator.subMenu[this.uiType]);

      const textList = TextConstants.MOBILE_SUB_MENU;
      const tabList = await this.getLocator(mobileLocator.subMenuTabList[this.uiType]);
      const txt = await this.getLocator(mobileLocator.subMenuTextImg[this.uiType]);

      for (let i = 0; i < await tabList.count(); i++) {
        await this.click(tabList.nth(i));
        const alt = await txt.nth(i).getAttribute('alt');
        const text = alt?.replace(/\s+/g, '').trim();
        await expect(text).toContain(textList[i].replace(/\s+/g, '').trim());
      }
      return true;
    } catch (err) {
      console.error('[submenuSectionCheck Failed]', err);
      return false;
    }
  }

  // -------------------------------------------------------------------- //
  // 장바구니

  // 장바구니 항목 선택 함수
  async cartSelect(target: string | Locator) {
    try {
      const elements = typeof target === 'string' ? this.getLocator(target) : target;
      const count = await elements.count();

      for (let i = 0; i < count; i++) {
        const el = elements.nth(i);
        if (await el.isVisible() && await el.isEnabled()) {
          await this.click(el, false);
          console.log(`[cartSelect] ${target} 클릭`);
          return;
        }
      }
      console.warn(`[cartSelect] ${target} 클릭 가능한 요소 없음`);
    } catch (err) {
      console.error(`[cartSelect] ${target} 항목 선택 실패`, err);
    }
  }

  private phoneName: string

  async phoneInfoCollectAndMoveDetailPage(): Promise<boolean> {
    try {
      const phoneImgList = await this.getLocator(mobileCartLocator.phoneImg[this.uiType]);
      const phonePriceList = await this.getLocator(mobileCartLocator.phonePrice[this.uiType]);
      const phoneNameList = await this.getLocator(mobileCartLocator.phoneName[this.uiType]);
      const phoneBtnList = await this.getLocator(mobileCartLocator.phoneOrderBtn[this.uiType]);

      let count = await phoneBtnList.count();
      let num = this.getRandomInt(0, count-1);

      console.log(count, num);

      // 신청 불가 상품 처리
      while (await phoneBtnList.nth(num).innerText() !== '신청하기') {
        num = this.getRandomInt(0, count-1);
      }

      await phoneImgList.nth(num).scrollIntoViewIfNeeded();
      await this.checkVisible(phoneImgList.nth(num));

      // 총 납부금액 0원인 상품 존재
      const checkText = await phonePriceList.nth(num).innerText();
      const reText = checkText.replace(/[^0-9]/g, '');
      console.log(`text : ${reText}`);
      await expect(Number(reText) >= 0).toBeTruthy();

      this.phoneName = await phoneNameList.nth(num).innerText();

      // 신청하기 버튼 클릭
      await this.click(phoneBtnList.nth(num));
      await this.checkURL(urlLocator.mobile_detail[this.platform]);
      await this.checkCommonModals();
      return true;
    } catch (err) {
      console.error('[phoneInfoCollectAndMoveDetailPage Failed]', err);
      return false;
    }
  }

  async selectConditionAndMoveCartPage(): Promise<boolean> {
    try {
      // 가입 유형
      await this.click(mobileCartLocator.signType[this.uiType], false);
      // 요금제 선택
      await this.click(mobileCartLocator.plan[this.uiType], false);
      // 요금제 특별 혜택
      await this.cartSelect(mobileCartLocator.benefit[this.uiType]);
      // 할인 방법
      await this.click(mobileCartLocator.discount[this.uiType], false);
      // 할부
      await this.click(mobileCartLocator.monthlyPayment[this.uiType], false);
      // 배송 방법
      await this.click(mobileCartLocator.delivery[this.uiType], false);
      // VIP 멤버십 혜택
      await this.cartSelect(mobileCartLocator.benefit2[this.uiType]);
      // 사은품
      await this.cartSelect(mobileCartLocator.gift[this.uiType]);
      // 매월 이용할 혜택
      await this.cartSelect(mobileCartLocator.gift2[this.uiType]);
      // 제휴카드 & 추가 할인 혜택
      if (await this.getLocator(mobileCartLocator.benefit2[this.uiType]).count() > 0){
        await this.cartSelect(await this.getLocator(mobileCartLocator.partnerCard[this.uiType]).nth(10).locator('div > div.radio-wrap ul li:nth-of-type(1)'));
        await this.cartSelect(await this.getLocator(mobileCartLocator.moreBenefit[this.uiType]).nth(11).locator('ul li:nth-of-type(1)'));
      } else {
        await this.cartSelect(await this.getLocator(mobileCartLocator.partnerCard[this.uiType]).nth(9).locator('div > div.radio-wrap ul li:nth-of-type(1)'));
        await this.cartSelect(await this.getLocator(mobileCartLocator.moreBenefit[this.uiType]).nth(10).locator('ul li:nth-of-type(1)'));
      }

      // 장바구니 버튼
      await this.click(mobileCartLocator.cartBtn[this.uiType]);
      // 장바구니로 이동 버튼
      await this.click(mobileCartLocator.moveCartBtn[this.uiType]);
      await this.checkURL(urlLocator.cart[this.platform]);
      return true;
    } catch (err) {
      console.error('[selectConditionAndMoveCartPage Failed]', err);
      return false;
    }
  }

  async cartPageCheckAndDeleteProduct(): Promise<boolean> {
    try {
      const cartPhoneImg = await this.getLocator(mobileCartLocator.cartImg[this.uiType]).last();
      const cartPhonePrice = await this.getLocator(mobileCartLocator.cartPrice[this.uiType]).last();
      const cartPhoneName = await this.getLocator(mobileCartLocator.cartName[this.uiType]).last();

      await this.checkVisible(cartPhoneImg);
      await this.checkPositiveNumber(cartPhonePrice);
      await this.checkText(cartPhoneName, this.phoneName);

      // 장바구니 항목 삭제
      const delBtn = await this.getLocator(mobileCartLocator.btnDel[this.uiType]);
      const count = await delBtn.count();

      for (let i = 0; i < count; i++) {
        // 항상 첫 번째 요소를 삭제
        if (await delBtn.first().isVisible()) {
          await this.click(delBtn.first());
          const checkBtn = await this.getLocator(uiLocator.modalFooter).locator('button').last();
          await this.click(checkBtn);
          await this.waitTime(0.5);
          await this.click(checkBtn);
        }
      }
      return true;
    } catch (err) {
      console.error('[cartPageCheckAndDeleteProduct Failed]', err);
      return false;
    }
  }

  // -------------------------------------------------------------------- //
  // 모바일 요금제 서브메인

  async dropdownClickAndMyInfoCheck(): Promise<boolean> {
    try {
      // 내 요금제 정보 드롭다운
      await this.click(mobilePlanLocator.myInfoDropDown[this.uiType]);
      // 월정액
      await this.checkPositiveNumber(mobilePlanLocator.myPlanPrice[this.uiType]);
      return true;
    } catch (err) {
      console.error('[dropdownClickAndMyInfoCheck Failed]', err);
      return false;
    }
  }

  async tabTextAndUrlAndListCheck(): Promise<boolean> {
    try {
      // 탭
      await this.checkText(mobilePlanLocator.tabList[this.uiType], TextConstants.MOBILE_PLAN_TAB);

      const tabList = await this.getLocator(mobilePlanLocator.tabListLink[this.uiType]);
      let count = await tabList.count();

      const urls = {
        0: urlLocator.plan[this.platform],
        1: urlLocator.direct[this.platform],
        2: urlLocator.device_2nd[this.platform],
        3: urlLocator.dual[this.platform]
      } as { [key: number]: string };

      for (let i = 0; i < count; i++) {
        await this.click(tabList.nth(i));
        await this.checkURL(urls[i]);
        await this.checkVisible(mobilePlanLocator.planList[this.uiType]);
      }
      return true;
    } catch (err) {
      console.error('[tabTextAndUrlAndListCheck Failed]', err);
      return false;
    }
  }

  // -------------------------------------------------------------------- //
  // 모바일 요금제 변경하기

  private planName: string
  private usingPlan: string

  async planInfoCollectAndMoveChangePage(): Promise<boolean> {
    try {
      // 사용중인 요금제
      this.usingPlan = await this.getLocator(mobilePlanLocator.myPlanName[this.uiType]).innerText();

      // 요금제 항목
      const planNameList = await this.getLocator(mobilePlanLocator.planName[this.uiType]);
      const planPriceList = await this.getLocator(mobilePlanLocator.planPrice[this.uiType]);
      const planBtnList = await this.getLocator(mobilePlanLocator.planChangeBtn[this.uiType]);

      let count = await planNameList.count();
      let num = await this.getRandomInt(0, count-1);

      this.planName = await planNameList.nth(num).innerText();

      // 현재 사용중인 요금제일 경우 처리
      if (this.usingPlan == this.planName && num == count-1) {
        num -= 1;
      } else if (this.usingPlan == this.planName && num < count-1) {
        num += 1;
      }

      this.planName = await planNameList.nth(num).innerText();

      await this.checkPositiveNumber(planPriceList.nth(num));
      await this.click(planBtnList.nth(num));

      // 혜택 선택
      if (await this.getLocator(uiLocator.modalHeader).count() == 0) {
        return true;
      }
      // 미디어 혜택
      else if ((await this.getLocator(mobilePlanLocator.benefitTitle[this.uiType]).innerText()).includes('미디어')) {
        const benefitList = await this.getLocator(mobilePlanLocator.benefitList[this.uiType]);
        await this.click(benefitList.nth(0));
        await this.click(mobilePlanLocator.benefitNextBtn[this.uiType]);
      }
      // 프리미엄 혜택
      else if ((await this.getLocator(mobilePlanLocator.benefitTitle[this.uiType]).innerText()).includes('프리미엄')) {
        const benefitList = await this.getLocator(mobilePlanLocator.benefitList[this.uiType]).elementHandles();
        for (const benefit of benefitList) {
          if ((await benefit.innerText()).includes('일리커피구독')) {
            await benefit.click();
            await this.click(mobilePlanLocator.benefitNextBtn[this.uiType]);
          }
        }
      }

      await this.checkURL(urlLocator.price_plan_change[this.platform]);
      return true;
    } catch (err) {
      console.error('[planInfoCollectAndMoveChangePage Failed]', err);
      return false;
    }
  }

  async planChangeTextAndNumberCheck(): Promise<boolean> {
    try {
      await this.checkText(mobilePlanLocator.planNameRow[this.uiType], [
        '요금제명',this.usingPlan,this.planName
      ]);
      await this.checkPositiveNumber(mobilePlanLocator.nowPrice[this.uiType]);
      await this.checkPositiveNumber(mobilePlanLocator.changePrice[this.uiType]);
      return true;
    } catch (err) {
      console.error('[planChangeTextAndNumberCheck Failed]', err);
      return false;
    }
  }

  // -------------------------------------------------------------------- //
  // 모바일 요금제 비교하기

  async planInfoCollectAndMoveComparePage(): Promise<boolean> {
    try {
      // 사용중인 요금제
      this.usingPlan = await this.getLocator(mobilePlanLocator.myPlanName[this.uiType]).innerText();

      // 요금제 항목
      const planNameList = await this.getLocator(mobilePlanLocator.planName[this.uiType]);
      const planBtnList = await this.getLocator(mobilePlanLocator.planCompareBtn[this.uiType]);

      let count = await planNameList.count();
      let num = await this.getRandomInt(0, count-1);

      this.planName = await planNameList.nth(num).innerText();

      // 현재 사용중인 요금제일 경우 처리
      if (this.usingPlan == this.planName && num == count-1) {
        num -= 1;
      } else if (this.usingPlan == this.planName && num < count-1) {
        num += 1;
      }

      this.planName = await planNameList.nth(num).innerText();

      await this.click(planBtnList.nth(num));

      await this.waitLoading();
      await this.checkURL(urlLocator.plan_compare[this.platform]);
      return true;
    } catch (err) {
      console.error('[planInfoCollectAndMoveComparePage Failed]', err);
      return false;
    }
  }

  async planCompareTextAndNumberCheck(): Promise<boolean> {
    try {
      const textList = [this.usingPlan, this.planName];
      let count = textList.length;

      for (let i = 0; i < count; i++) {
        const el = await this.getLocator(mobilePlanLocator.comparePagePlanName[this.uiType]);
        await this.checkText(el.nth(i), textList[i]);
      }

      const comparePagePrice = await this.getLocator(mobilePlanLocator.comparePagePlanPrice[this.uiType]);
      count = await comparePagePrice.count();

      for (let i = 0; i < count; i++) {
        await this.checkPositiveNumber(comparePagePrice.nth(i));
      }
      return true;
    } catch (err) {
      console.error('[planCompareTextAndNumberCheck Failed]', err);
      return false;
    }
  }
}
