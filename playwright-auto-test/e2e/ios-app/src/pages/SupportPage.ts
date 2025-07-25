import { AppActions } from '@common/actions/AppActions.js';
import { supportLocator } from '@common/locators/supportLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Browser } from 'webdriverio';





export class SupportPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }

  async goToSupport(): Promise<void> {
    try {
      await this.goToHome();
      await this.waitAndClick(uiLocator.hamburger[this.uiType]);
      await this.waitAndClick(supportLocator.supportGnB);
      await this.waitAndClick(supportLocator.supportSubMain);
      await this.isDelay();
    } catch (err) {
      console.log(err, '고객지원 이동 실패');
    }
  }
  async favoriteSearchCase(): Promise<boolean> {
    try {
      await this.goToSupport();
      const termText = await this.getInnerText(supportLocator.favoriteTerm);
      console.log('검색어 리스트 : ', termText);
      const searchTerm = await this.driver.$(supportLocator.searchFavorite).getText();
      await this.iosClick(supportLocator.searchFavorite);
      await this.isDelay();

      return await this.hasElementContainingText(supportLocator.searchList, searchTerm);
    } catch (err) {
      console.log(err, '자주 찾는 검색어 케이스 실패');
      return false;
    }
  }
  async listOpen(): Promise<boolean> {
    try {
      await this.goToSupport();
      await this.smoothScrollTo(supportLocator.faqListSection);
      const faqList = await this.driver.$$(supportLocator.faqList);
      const faqCount = await faqList.length;
      console.log(faqCount);
      return true;
    } catch (err) {
      console.log(err, '리스트오픈 실패');
      return false;
    }
  }
  async helpSupportList(): Promise<boolean> {
    try {
      await this.goToSupport();
      await this.smoothScrollTo(supportLocator.questionListSection);
      await this.isDelay();
      const questionList = await this.driver.$$(supportLocator.iosQuestionList);
      const questionListCount = await questionList.length;
      console.log('도움이 될만한 리스트 개수 : ', questionListCount);
      return questionListCount > 0;
    } catch (err) {
      console.log(err, '도움이 될만한 리스트 확인 실패');
      return false;
    }
  }
  async useGuide(): Promise<boolean> {
    try {
      await this.goToSupport();
      await this.smoothScrollTo(supportLocator.guide[this.uiType]);
      await this.waitAndClick(supportLocator.guide[this.uiType]);
      await this.isDelay();

      //이용가이드 탭리스트 텍스트 추출
      const guideText = await this.getAllInnerTexts(supportLocator.guideTab[this.uiType]);
      const cleanedGuideText = guideText[0].split('\n').map(text => text.trim());
      console.log(cleanedGuideText);
      return await this.isCurrentUrlIncludes(supportLocator.supportUrl);
    } catch (err) {
      console.log(err, '유저가이드 확인 실패');
      return false;
    }
  }
}
