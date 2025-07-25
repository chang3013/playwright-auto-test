import { ActionConstants } from '@common/constants/ActionConstants.js';
import { uiLocator } from '@common/locators/uiLocator.js';
import type { Platform } from '@common/types/platform-types.js';
import { ContextUtils } from '@common/utils/context/contextUtils.js';
import { POCEnv } from '@common/utils/env/POCEnv';
import { execSync } from 'child_process';
import type { ChainablePromiseElement } from 'webdriverio';
import type { Browser } from 'webdriverio';





// WebdriverIO.Browser['$'] 의 반환 타입(Awaited)을 추출
type Locator = Awaited<ReturnType<Browser['$']>>;

export async function getLocator(driver: Browser, selector: string): Promise<Locator> {
  const el = await driver.$(selector);
  return el;
}
