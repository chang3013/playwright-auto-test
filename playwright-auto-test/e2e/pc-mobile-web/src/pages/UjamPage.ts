import { WebActions } from '@common/actions/WebActions.js';
import { ujamLocator } from '@common/locators/ujamLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';

export class UjamPage extends WebActions {
  protected readonly platform: Platform = 'MOBILE_WEB';
  protected readonly uiType: UIType = 'MOBILE';

  constructor(page: Page) {
    super(page);
  }

  /**
   * 유잼
   */
  async ujam(): Promise<boolean> {
    try {

      return true;
    } catch (err) {
      console.error('[ujam Failed]', err);
      return false;
    }
  }
}
