import { WebActions } from '@common/actions/WebActions.js';
import { mainLocator } from '@common/locators/mainLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';

export class MainPage extends WebActions {
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super(page);
  }

  async keyVisualImageCheck(): Promise<boolean> {
    try {
      // KV
      await this.checkImg(mainLocator.kvImg[this.uiType]);
      await this.checkImg(mainLocator.kvImg2[this.uiType]);
      return true;
    } catch (err) {
      console.error('[keyVisualImageCheck Failed]', err);
      return false;
    }
  }

  async udocSectionCheck(): Promise<boolean> {
    try {
      // 유독
      await this.checkTitle(mainLocator.udocTitle[this.uiType], "내 일상에 필요한 구독, 유독");
      await this.checkImg(mainLocator.udocImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[udocSectionCheck Failed]', err);
      return false;
    }
  }

  async recommendMobileSectionCheck(): Promise<boolean> {
    try {
      // 기기 추천
      await this.checkTitle(mainLocator.deviceTitle[this.uiType], "추천! 지금 인기 모바일");
      await this.click(mainLocator.deviceTitle[this.uiType]);
      await this.checkURL(urlLocator.phone[this.platform]);
      await this.gotoHomePage();
      const deviceNameList = await this.getLocator(mainLocator.deviceName[this.uiType]);
      const num = await this.getRandomInt(0, await deviceNameList.count() - 1);
      // 기기 상세
      const deviceName = await deviceNameList.nth(num).innerText();
      await this.click(deviceNameList.nth(num));
      await this.checkURL(urlLocator.mobile_detail[this.platform]);
      const detailDeviceName = await this.getLocator(mainLocator.detailDeviceName[this.uiType]);
      await this.checkText(detailDeviceName, deviceName);
      await this.gotoHomePage();
      return true;
    } catch (err) {
      console.error('[recommendMobileSectionCheck Failed]', err);
      return false;
    }
  }

  async recommendPlanSectionCheck(): Promise<boolean> {
    try {
      // 요금제 추천
      await this.checkTitle(mainLocator.planBenefitTitle[this.uiType], "주목! 혜택 좋은 요금제");
      await this.click(mainLocator.planBenefitTitle[this.uiType]);
      await this.checkURL(urlLocator.plan[this.platform]);
      await this.gotoHomePage();
      const planNameList = await this.getLocator(mainLocator.planName[this.uiType]);
      const num = await this.getRandomInt(0, await planNameList.count() - 1);
      // 요금제 상세
      const planName = await planNameList.nth(num).innerText();
      await this.click(planNameList.nth(num));
      await this.checkURL(urlLocator.plan_detail[this.platform]);
      const detailPlanName = await this.getLocator(mainLocator.detailPlanName[this.uiType]);
      await this.checkText(detailPlanName, planName);
      await this.gotoHomePage();
      return true;
    } catch (err) {
      console.error('[recommendPlanSectionCheck Failed]', err);
      return false;
    }
  }

  async recommendIptvSectionCheck(): Promise<boolean> {
    try {
      // iptv 추천
      await this.checkTitle(mainLocator.iptvTitle[this.uiType], "절약! 인터넷/IPTV 가입");
      await this.click(mainLocator.iptvTitle[this.uiType]);
      await this.checkURL(urlLocator.iptvPlan[this.platform]);
      await this.gotoHomePage();
      const iptvNameList = await this.getLocator(mainLocator.iptvName[this.uiType]);
      const num = await this.getRandomInt(0, await iptvNameList.count() - 1);
      // iptv 상세
      const iptvName = iptvNameList.nth(num);
      await this.click(iptvNameList.nth(num));
      await this.checkURL(urlLocator.iptv_detail[this.platform]);
      const detailIptvName = await this.getLocator(mainLocator.detailIptvName[this.uiType]);

      let detailIptvNameList = [];

      for (let i = 0; i < await detailIptvName.count(); i++) {
        const name = await detailIptvName.nth(i).innerText();
        detailIptvNameList.push(name);
      }

      await this.gotoHomePage();
      await this.checkText(iptvName, detailIptvNameList);
      return true;
    } catch (err) {
      console.error('[recommendIptvSectionCheck Failed]', err);
      return false;
    }
  }

  async useGuideSectionCheck(): Promise<boolean> {
    try {
      // 유플닷컴 이용 가이드
      await this.checkTitle(mainLocator.guideTitle[this.uiType], "유플닷컴 이용 가이드");
      await this.checkEl(mainLocator.guideList[this.uiType]);
      return true;
    } catch (err) {
      console.error('[useGuideSectionCheck Failed]', err);
      return false;
    }
  }

  async eventSectionCheck(): Promise<boolean> {
    try {
      // 이벤트
      await this.checkTitle(mainLocator.eventTitle[this.uiType], "진행 중 이벤트");
      await this.checkImg(mainLocator.eventImg[this.uiType]);
      await this.click(mainLocator.eventTitle[this.uiType]);
      await this.checkURL(urlLocator.benefit_event[this.platform]);
      await this.gotoHomePage();
      return true;
    } catch (err) {
      console.error('[eventSectionCheck Failed]', err);
      return false;
    }
  }

  async ujamSectionCheck(): Promise<boolean> {
    try {
      // 유잼
      await this.checkTitle(mainLocator.ujamTitle[this.uiType], "추천 콘텐츠! 잼과 이득이 가득가득");
      await this.checkImg(mainLocator.ujamImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[ujamSectionCheck Failed]', err);
      return false;
    }
  }

  async ourLifeSectionCheck(): Promise<boolean> {
    try {
      // 유플닷컴 통신 생활
      await this.checkTitle(mainLocator.ourLifeTitle[this.uiType], "유플닷컴 통신 생활");
      await this.checkImg(mainLocator.ourLifeImg[this.uiType]);
      return true;
    } catch (err) {
      console.error('[ourLifeSectionCheck Failed]', err);
      return false;
    }
  }

  async suggestSectionCheck(): Promise<boolean> {
    try {
      // 이럴 땐 U렇게
      await this.checkTitle(mainLocator.suggestTitle[this.uiType], "이럴 땐 U렇게");
      await this.checkImg(mainLocator.suggestImg[this.uiType]);
      await this.click(mainLocator.suggestTitle[this.uiType]);
      await this.checkURL(urlLocator.support_self[this.platform]);
      return true;
    } catch (err) {
      console.error('[suggestSectionCheck Failed]', err);
      return false;
    }
  }

  // -------------------------------------------------------------------- //
  // 메인페이지 > 개인화

  async appDownloaSectionCheck(): Promise<boolean> {
    try {
      // 앱 다운로드
      await this.click(mainLocator.appDownload[this.uiType]);
      await this.checkURL(urlLocator.downloadApp);
      await this.gotoHomePage();
      return true;
    } catch (err) {
      console.error('[appDownloadSectionCheck Failed]', err);
      return false;
    }
  }

  async myPageSectionCheck(): Promise<boolean> {
    try {
      // 마이페이지
      await this.click(mainLocator.mainMyPage[this.uiType]);
      await this.checkURL(urlLocator.mypage[this.platform]);
      await this.gotoHomePage();
      return true;
    } catch (err) {
      console.error('[myPageSectionCheck Failed]', err);
      return false;
    }
  }

  async benefitSectionCheck(): Promise<boolean> {
    try {
      // 닷컴만의 혜택
      await this.click(mainLocator.benefit[this.uiType]);
      await this.checkURL(urlLocator.memberPrivateBenefit[this.platform]);
      return true;
    } catch (err) {
      console.error('[benefitSectionCheck Failed]', err);
      return false;
    }
  }
}
