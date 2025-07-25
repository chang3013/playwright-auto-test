import { ANDROID_DEVICES, IOS_DEVICES } from '@common/config/deviceConfig';
import { test as base, TestType } from '@playwright/test';
import path from 'path';
import { remote, type Browser as WDIOBrowser } from 'webdriverio';

type Fixtures = {
  poc: string;
  appDriver: WDIOBrowser;
};

export class BaseAppFixture {
  public getTestExtend(): TestType<Fixtures, {}> {
    return base.extend<Fixtures>({
      poc: async ({}, use) => {
        const poc = (process.env.POC || '').toLowerCase();
        await use(poc);
      },

      appDriver: async ({ poc }, use) => {
        const port = poc === 'ios' ? 4723 : 4725;

        await this.launchAppiumIfNeeded(poc, port);

        const deviceKey = poc === 'ios' ? 'iPhone 12 Pro Max' : 'Galaxy ZFilp4';
        const device = poc === 'ios' ? IOS_DEVICES[deviceKey] : ANDROID_DEVICES[deviceKey];

        if (!device?.appium?.options) {
          throw new Error(`Device configuration for ${deviceKey} not found.`);
        }

        const appiumOptions = { ...device.appium.options };

        // ✅ Android일 경우 ChromeDriver 경로 지정
        if (poc === 'aos') {
          appiumOptions.chromedriverExecutable = path.resolve(
            process.cwd(),
            'common/assets/driver/138.0.7204.92/chromedriver',
          );
        }

        const driver = await remote({
          protocol: 'http',
          hostname: 'localhost',
          port,
          path: '/wd/hub',
          logLevel: 'silent',
          connectionRetryTimeout: 1800000,
          capabilities: {
            platformName: device.platformName,
            'appium:options': appiumOptions,
          },
        });

        await use(driver);
        // await driver.deleteSession();
      },
    });
  }

  private async launchAppiumIfNeeded(poc: string, port: number): Promise<void> {
    const logDirPath =
      poc === 'ios'
        ? path.resolve(process.cwd(), 'e2e/ios-appium-server/logs')
        : path.resolve(process.cwd(), 'e2e/aos-appium-server/logs');

    const { AppiumServerUtils } =
      poc === 'ios'
        ? await import('@e2e/ios-appium-server/AppiumServerUtils')
        : await import('@e2e/aos-appium-server/AppiumServerUtils');

    const { checkAppiumStatus } =
      poc === 'ios'
        ? await import('@e2e/ios-appium-server/Utils/checkAppiumStatus')
        : await import('@e2e/aos-appium-server/Utils/checkAppiumStatus');

    const isReady = await checkAppiumStatus(port);
    if (isReady) {
      console.info(`[BaseAppFixture] Appium 서버 이미 실행 중 (포트: ${port})`);
      return;
    }

    console.info(`[BaseAppFixture] Appium 서버 실행 시도: ${poc} (포트: ${port})`);

    await AppiumServerUtils.start({
      port,
      platform: poc === 'ios' ? 'ios' : 'aos',
      logDirPath,
    });

    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
      if (await checkAppiumStatus(port)) {
        console.info(`[BaseAppFixture] Appium 서버 새로 실행됨. (포트: ${port})`);
        return;
      }
      await new Promise(r => setTimeout(r, 1000));
    }

    throw new Error(`[Appium] 포트 ${port} 서버 준비 실패`);
  }
}

export const appFixture = new BaseAppFixture();
export const test = appFixture.getTestExtend();
export { expect } from '@playwright/test';
