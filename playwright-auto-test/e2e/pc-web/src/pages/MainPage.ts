import { WebActions } from '@common/actions/WebActions.js';
import { TextConstants } from '@common/constants/TextConstants.js';
import { mainLocator } from '@common/locators/mainLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';

export class MainPage extends WebActions {
  protected readonly platform: Platform = 'PC_WEB';
  protected readonly uiType: UIType = 'PC';

  constructor(page: Page) {
    super(page);
  }

  async keyVisualImageCheck(): Promise<boolean> {
    try {
      // KV
      await this.checkImg(mainLocator.kvImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[keyVisualImageCheck Failed]', err);
      return false;
    }
  }

  async eventSectionCheck(): Promise<boolean> {
    try {
      // 이벤트
      await this.checkTitle(mainLocator.eventTitle[this.uiType], "유플러스 이벤트를 만나보세요");
      await this.checkImg(mainLocator.eventImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[eventSectionCheck Failed]', err);
      return false;
    }
  }

  async recommendMobileSectionCheck(): Promise<boolean> {
    try {
      // 기기 추천
      await this.checkTitle(mainLocator.deviceTitle[this.uiType], "가장 많은 혜택을 받는\n기기를 추천해 드려요");
      await this.click(mainLocator.deviceTab[this.uiType]);
      await this.checkImg(mainLocator.deviceImg[this.uiType]);
      // 5G 휴대폰 전체보기 클릭
      await this.click(mainLocator.deviceAllBtn[this.uiType]);
      await this.checkURL(urlLocator.phone[this.platform]);
      await this.gotoHomePage();
      return true;
    } catch (err) {
      console.error('[recommendMobileSectionCheck Failed]', err);
      return false;
    }
  }

  async udocSectionCheck(): Promise<boolean> {
    try {
      // 유독
      await this.checkTitle(mainLocator.udocTitle[this.uiType], "내 일상에 필요한 서비스를 구독,");
      await this.checkImg(mainLocator.udocImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[udocSectionCheck Failed]', err);
      return false;
    }
  }

  async planBenefitSectionCheck(): Promise<boolean> {
    try {
      // 요금제 혜택
      await this.checkTitle(mainLocator.planBenefitTitle[this.uiType], "함께하면 더 특별한\n5G 요금제와 혜택을 누리세요");
      await this.checkImg(mainLocator.planBenefitImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[recommendPlanSectionCheck Failed]', err);
      return false;
    }
  }

  async ujamSectionCheck(): Promise<boolean> {
    try {
      // 유잼
      await this.checkTitle(mainLocator.ujamTitle[this.uiType], "잼과 이득이 가득가득,\n유플러스만의 통신 꿀팁 공간");
      await this.checkImg(mainLocator.ujamImg[this.uiType]);
      // 유잼 바로가기 클릭
      await this.click(mainLocator.ujamBtn[this.uiType]);
      await this.checkURL(urlLocator.ujamUrl[this.platform]);
      await this.gotoHomePage();
      return true;
    } catch (err) {
      console.error('[ujamSectionCheck Failed]', err);
      return false;
    }
  }

  async customSectionCheck(): Promise<boolean> {
    try {
      // 하단 커스텀
      await this.checkTitle(mainLocator.customTitle[this.uiType], "도움이 필요하신가요?");
      await this.checkImg(mainLocator.customImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[customSectionCheck Failed]', err);
      return false;
    }
  }

  // -------------------------------------------------------------------- //
  // 메인페이지 > 개인화

  async toggleClickAndMyInfoOpen(): Promise<boolean> {
    try {
      // 펼치기
      await this.click(mainLocator.toggle[this.uiType]);
      await this.waitTime(2);
      return true;
    } catch (err) {
      console.error('[toggleClickAndMyInfoOpen Failed]', err);
      return false;
    }
  }

  async myInfoTextCheck(): Promise<boolean> {
    try {
      const section = await this.getLocator(mainLocator.myInfo[this.uiType]);
      let count = await section.count();
      const textList = TextConstants.MAIN_MY_INFO;

      for (let i = 0; i < count; i++) {
        await this.checkText(section.nth(i), textList[i]);
      }
      return true;
    } catch (err) {
      console.error('[myInfoTextCheck Failed]', err);
      return false;
    }
  }

  async myInfoNumberCheck(): Promise<boolean> {
    try {
      // 데이터
      await this.checkPositiveNumber(mainLocator.myData[this.uiType]);
      // 청구요금
      await this.checkPositiveNumber(mainLocator.myCharge[this.uiType]);
      return true;
    } catch (err) {
      console.error('[myInfoTextCheck Failed]', err);
      return false;
    }
  }
}
