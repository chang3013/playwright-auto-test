/**
 * Description : MobileActions.ts - 📌 Playwright 모바일 웹 전용 액션 유틸리티 클래스
 */
import { BaseActions } from '@common/actions/BaseActions.js';
import type { Page } from '@playwright/test';

export class MobileActions extends BaseActions<undefined> {
  constructor(page: Page) {
    super(page);
    this.setPlaywrightPage(page);
  }

  async prepare(): Promise<void> {
  }
}
