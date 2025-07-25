import { AppActions } from '@common/actions/AppActions.js';
import { searchLocator } from '@common/locators/searchLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import { ContextUtils } from '@common/utils/context/contextUtils.js';
import { auth } from 'google-auth-library';
import type { Browser } from 'webdriverio';

export class SearchPage extends AppActions {
  protected platform: Platform;
  protected uiType: UIType;

  constructor(driver: Browser) {
    super(driver);
    this.platform = 'IOS_APP';
    this.uiType = 'APP';
  }

  async searchPageCheck(): Promise<boolean> {
    try {
      await this.goToHome();
      await this.waitAndClick(searchLocator.searchBtn[this.uiType]);
      await this.waitForPageLoad();
      await this.driver.pause(500);

      //인기검색어 확인
      const keyWord = await this.getAllInnerTexts(searchLocator.keyword[this.uiType]);
      const keyWordLength = await keyWord.length;
      console.log('오늘의 인기검색어 순위 : ', keyWordLength);
      console.log(keyWord);

      return keyWordLength > 0;
    } catch (err) {
      console.log(err, 'SearchPage 요소 확인 실패');
      return false;
    }
  }

  async optionTerm(): Promise<boolean> {
    try {
      await this.typeSlowly(searchLocator.searchInput[this.uiType], searchLocator.search_text[0]);
      await this.waitAndClick(searchLocator.searchBtn[this.uiType]);
      await this.smoothScrollTo(searchLocator.resultSection);

      return await this.hasElementContainingText(
        searchLocator.resultList,
        searchLocator.search_text[0],
      );
    } catch (err) {
      console.log(err, '테스트 검색 케이스 실패');
      return false;
    }
  }
  async specialTerm(): Promise<boolean> {
    try {
      await this.goToHome();
      await this.waitAndClick(searchLocator.searchBtn[this.uiType]);
      await this.typeSlowly(searchLocator.searchInput[this.uiType], searchLocator.search_text[1]);
      await this.waitAndClick(searchLocator.searchBtn[this.uiType]);
      await this.isDelay();
      return await this.hasElementContainingText(
        searchLocator.resultBox,
        searchLocator.search_text[1],
      );
    } catch (e) {
      console.log('검색창에 입력 중 오류 발생 : ', e);
      return false;
    }
  }
  async noneTerm(): Promise<boolean> {
    try {
      await this.goToHome();
      await this.waitAndClick(searchLocator.searchBtn[this.uiType]);
      await this.typeSlowly(searchLocator.searchInput[this.uiType], searchLocator.search_text[2]);
      await this.waitAndClick(searchLocator.searchBtn[this.uiType]);
      await this.isDelay();

      return (
        (await this.elementsContainingText(
          searchLocator.noneResultBox,
          searchLocator.search_text[2],
        )) == 1
      );
    } catch (err) {
      console.log('결과없음 케이스 실패');
      return false;
    }
  }
  async hashTagTerm(): Promise<boolean> {
    try {
      await this.goToHome();
      await this.isDelay();
      await this.waitAndClick(searchLocator.searchBtn[this.uiType]);
      await this.getAllInnerTexts(searchLocator.hashTag);
      const normalize = (text: string | null) =>
        text
          ?.replace(/[#\s\u200b]/g, '')
          .normalize()
          .trim();

      const hashtagText = normalize(await this.randomChoiceReturnText(searchLocator.hashTag));
      await this.isDelay();
      await this.closeAnyModal([...uiLocator.modal_selector]);
      const searchInputText = normalize(await this.getInnerText(searchLocator.resultInput));

      console.log('⛳️ 비교용 해시태그:', hashtagText);
      console.log('⛳️ 비교용 검색입력:', searchInputText);

      return hashtagText === searchInputText;
    } catch (err) {
      console.log(err, '해시태그 검색어 케이스 실패');
      return false;
    }
  }
}
