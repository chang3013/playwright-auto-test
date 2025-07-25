import { WebActions } from '@common/actions/WebActions.js';
import { udocLocator } from '@common/locators/udocLocator.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import { urlLocator } from '@common/locators/urlLocator.js';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Page } from '@playwright/test';

export class UdocPage extends WebActions {
  protected readonly platform: Platform = 'PC_WEB';
  protected readonly uiType: UIType = 'PC';

  constructor(page: Page) {
    super(page);
  }

  /**
   * 유독
   */
  async udoc(): Promise<boolean> {
    try {

      return true;
    } catch (err) {
      console.error('[udoc Failed]', err);
      return false;
    }
  }
}
