import { WebActions } from '@common/actions/WebActions.js';
import { searchLocator } from '@common/locators/searchLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';

export class SearchPage extends WebActions {
  protected readonly platform: Platform = 'PC_WEB';
  protected readonly uiType: UIType = 'PC';

  constructor(page: Page) {
    super(page);
  }

  // 검색 결과 체크 함수
  async searchResultCheck(searchList: string[]) {
    for (let i = 0; i < searchList.length; i++) {
      await this.checkCommonModals();
      await this.ensurePage().fill(searchLocator.searchInput[this.uiType], searchList[i]);
      await this.click(searchLocator.searchBtn[this.uiType]); // 검색(돋보기) 버튼

      await this.waitTime(1);
      await this.checkCommonModals();

      if (i === 0) {
        await this.checkText(searchLocator.searchTerm[this.uiType], searchList[i]);
      } else {
        const searchResult = await this.getLocator(searchLocator.searchResult[this.uiType]);
        await this.checkText(searchResult, [searchList[i], "검색 결과가 없습니다"]);
      }
    }
  }

  private searchText2: string

  async searchButtonClick(): Promise<boolean> {
    try {
      await this.gotoHomePage();
      await this.click(uiLocator.searchGNB[this.uiType]);
      return true;
    } catch (err) {
      console.error('[searchButtonClick Failed]', err);
      return false;
    }
  }

  async clickKeywordAndTextCheck(): Promise<boolean> {
    try {
      // 인기검색어 리스트
      const searchList = await this.getLocator(searchLocator.keyword[this.uiType]);

      const count = await searchList.count();
      const num = this.getRandomInt(0, count-1);
      const rawText = await searchList.nth(num).innerText();
      const searchText = rawText.replace((num + 1).toString(), '');
      console.log(`searchText: ${searchText}`);

      const num2 = this.getRandomInt(0, count-1);
      const rawText2 = await searchList.nth(num2).innerText();
      this.searchText2 = rawText2.replace((num2 + 1).toString(), '');
      console.log(`searchText2: ${this.searchText2}`);

      await this.click(searchList.nth(num));
      await this.checkText(searchLocator.searchTerm[this.uiType], searchText);
      return true;
    } catch (err) {
      console.error('[clickKeywordAndTextCheck Failed]', err);
      return false;
    }
  }

  async searchKeywordAndResultCheck(): Promise<boolean> {
    try {
      const textList = [this.searchText2, '결과 없음', '~!@#$%^&*'];
      await this.searchResultCheck(textList);
      return true;
    } catch (err) {
      console.error('[searchKeywordAndResultCheck Failed]', err);
      return false;
    }
  }
}
