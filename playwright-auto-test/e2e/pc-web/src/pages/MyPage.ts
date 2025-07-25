import { WebActions } from '@common/actions/WebActions.js';
import { TextConstants } from '@common/constants/TextConstants.js';
import { mypageLocator } from '@common/locators/mypageLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class MyPage extends WebActions {
  protected readonly platform: Platform = 'PC_WEB';
  protected readonly uiType: UIType = 'PC';

  constructor(page: Page) {
    super(page);
  }

  // -------------------------------------------------------------------- //
  // 마이페이지 서브메인

  async claimAndPaymentSectionCheck(): Promise<boolean> {
    try {
      // 청구 및 납부 정보
      await this.checkText(mypageLocator.myInfo[this.uiType], TextConstants.MYPAGE_INFO);
      // 청구요금 - 0보다 큰지 확인
      await this.checkPositiveNumber(mypageLocator.myInfoCharge[this.uiType]);
      return true;
    } catch (err) {
      console.error('[claimAndPaymentSectionCheck Failed]', err);
      return false;
    }
  }

  async moreBillCheck(): Promise<boolean> {
    try {
      // 청구서 더 보기
      await this.click(mypageLocator.myInfoMoreBtn[this.uiType]);
      await this.checkPositiveNumber(mypageLocator.moreInfoCharge[this.uiType]);
      await this.click(uiLocator.modalHeaderClose);
      return true;
    } catch (err) {
      console.error('[moreBillCheck Failed]', err);
      return false;
    }
  }

  // -------------------------------------------------------------------- //
  // 마이페이지 요급/납부

  async claimAndPaymentInfoCheck(): Promise<boolean> {
    try {
      // 요금/납부 정보
      await this.checkTitle(mypageLocator.myPageTitle[this.uiType], "요금/납부");

      await this.checkText(mypageLocator.myBillInfo[this.uiType], TextConstants.MYBILL_INFO);
      return true;
    } catch (err) {
      console.error('[claimAndPaymentInfoCheck Failed]', err);
      return false;
    }
  }

  async tabTextAndHeaderCheck(): Promise<boolean> {
    try {
      // 요금/납부 탭
      const textList = TextConstants.MYBILL_TAB;
      await this.checkText(mypageLocator.myBillTab[this.uiType], textList);

      // 탭 text와 클릭 시 모달창 헤더 text 비교
      const buttonList = await this.getLocator(mypageLocator.myBillTabList[this.uiType]);
      let count = await buttonList.count();
      for (let i = 0; i < count; i++) {
        await this.click(buttonList.nth(i));
        await this.waitTime(3);

        const header = await this.getLocator(uiLocator.modalHeader).first();
        await this.checkText(header, textList[i]);

        const closeBtn = await this.getLocator(uiLocator.modalHeaderClose);
        await this.click(closeBtn.last());
      }
      return true;
    } catch (err) {
      console.error('[claimAndPaymentInfoCheck Failed]', err);
      return false;
    }
  }

  async claimSectionCheck(): Promise<boolean> {
    try {
      // 청구내역
      await this.checkTitle(mypageLocator.chargeTitle[this.uiType], "청구내역");
      const secondSection = await this.getLocator(mypageLocator.chargeList[this.uiType]);
      await secondSection.scrollIntoViewIfNeeded();

      // 청구월
      const month = await this.getLocator(mypageLocator.chargeMonth[this.uiType]);
      const count = await month.count();
      const num = await this.getRandomInt(0, count-1);
      await expect(month.nth(num)).toHaveText(/^\d{4}-\d{2}$/);

      // 청구금액
      const pay = await this.getLocator(mypageLocator.chargeAmount[this.uiType]);
      await this.checkPositiveNumber(pay.nth(num));
      return true;
    } catch (err) {
      console.error('[claimSectionCheck Failed]', err);
      return false;
    }
  }

  async paymentSectionCheck(): Promise<boolean> {
    try {
      // 납부내역
      await this.checkTitle(mypageLocator.paymentTitle[this.uiType], "납부내역");
      const thirdSection = await this.getLocator(mypageLocator.paymentList[this.uiType]);
      await thirdSection.scrollIntoViewIfNeeded();

      // 납부일
      const day = await this.getLocator(mypageLocator.paymentDate[this.uiType]);
      const count = await day.count();
      const num = await this.getRandomInt(0, count-1);
      await expect(day.nth(num)).toHaveText(/^\d{4}-\d{2}-\d{2}$/);

      // 납부금액
      const pay = await this.getLocator(mypageLocator.paymentAmount[this.uiType]);
      await this.checkPositiveNumber(pay.nth(num));
      return true;
    } catch (err) {
      console.error('[paymentSectionCheck Failed]', err);
      return false;
    }
  }

  // -------------------------------------------------------------------- //
  // 마이페이지 사용내역 조회

  async usageHistoryCheck(): Promise<boolean> {
    try {
      // 사용내역 조회
      await this.checkTitle(mypageLocator.myPageTitle[this.uiType], "사용내역 조회");
      return true;
    } catch (err) {
      console.error('[tabTextCheck Failed]', err);
      return false;
    }
  }

  async tabTextCheck(): Promise<boolean> {
    try {
      // 탭
      await this.checkText(mypageLocator.useTab[this.uiType], TextConstants.MYUSE_TAB);
      return true;
    } catch (err) {
      console.error('[tabTextCheck Failed]', err);
      return false;
    }
  }

  async chargeSectionCheck(): Promise<boolean> {
    try {
      // 실시간 요금 조회
      // 현재까지 사용한 요금
      const pay = await this.getLocator(mypageLocator.useCharge[this.uiType]);
      await this.checkNumber(pay);

      // 합계
      const total = await this.getLocator(mypageLocator.useTotalCharge[this.uiType]);
      await this.checkNumber(total);
      await expect(await pay.innerText() == await total.innerText()).toBeTruthy();
      return true;
    } catch (err) {
      console.error('[chargeSectionCheck Failed]', err);
      return false;
    }
  }

  async monthlyUsageCheck(): Promise<boolean> {
    try {
      // 월별 사용량 조회
      await this.click(mypageLocator.useMonthTab[this.uiType]);
      // 월별 사용량 상세조회
      await this.click(mypageLocator.monthDetailBtn[this.uiType]);
      await this.checkText(mypageLocator.monthDetailTab[this.uiType], TextConstants.MYUSE_MONTH_DETAIL_TAB);
      return true;
    } catch (err) {
      console.error('[monthlyUsageCheck Failed]', err);
      return false;
    }
  }

  async callDetailsCheck(): Promise<boolean> {
    try {
      // 통화상세내역
      await this.click(mypageLocator.callDetailTab[this.uiType]);
      await this.checkText(mypageLocator.callDetailInfo[this.uiType], TextConstants.MYUSE_CALL_DETAIL_INFO);

      await this.checkVisible(mypageLocator.callDetailBtn[this.uiType]);
      return true;
    } catch (err) {
      console.error('[callDetailsCheck Failed]', err);
      return false;
    }
  }
}
