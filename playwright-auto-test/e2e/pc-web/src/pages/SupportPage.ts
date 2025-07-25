import { WebActions } from '@common/actions/WebActions.js';
import { TextConstants } from '@common/constants/TextConstants.js';
import { supportLocator } from '@common/locators/supportLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class SupportPage extends WebActions {
  protected readonly platform: Platform = 'PC_WEB';
  protected readonly uiType: UIType = 'PC';

  constructor(page: Page) {
    super(page);
  }

  async keywordClickAndResultCheck(): Promise<boolean> {
    try {
      // 자주찾는 검색어
      const searchKeyword = await this.getLocator(supportLocator.searchTerm[this.uiType]);

      let count = await searchKeyword.count();
      let num = this.getRandomInt(0, count-1);

      const keywordText = await searchKeyword.nth(num).innerText();
      await expect(keywordText.trim()).not.toBe('');

      await this.click(searchKeyword.nth(num));
      await this.checkURL(urlLocator.faq[this.platform]);
      await this.checkText(supportLocator.searchResult[this.uiType], keywordText);

      await this.gotoURL(urlLocator.support[this.platform]);
      return true;
    } catch (err) {
      console.error('[keywordClickAndResultCheck Failed]', err);
      return false;
    }
  }

  async questionListElementCheck(): Promise<boolean> {
    try {
      // 도움이 될 내용
      await this.checkEl(supportLocator.questionList[this.uiType]);
      return true;
    } catch (err) {
      console.error('[questionListElementCheck Failed]', err);
      return false;
    }
  }

  async solutionSectionCheck(): Promise<boolean> {
    try {
      // 간편 해결
      await this.checkImg(supportLocator.solution[this.uiType]);
      // 더 보기
      await this.click(supportLocator.solutionMoreBtn[this.uiType]);
      await this.checkURL(urlLocator.support_self[this.platform]);
      await this.gotoURL(urlLocator.support[this.platform]);
      return true;
    } catch (err) {
      console.error('[solutionSectionCheck Failed]', err);
      return false;
    }
  }

  async moveGuidePageAndTextCheck(): Promise<boolean> {
    try {
      // 이용 가이드
      await this.checkText(supportLocator.guide[this.uiType], TextConstants.SUPPORT_GUIDE);
      return true;
    } catch (err) {
      console.error('[moveGuidePageAndTextCheck Failed]', err);
      return false;
    }
  }
}
