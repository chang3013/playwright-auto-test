/**
 * Description : deviceConfig.ts - 📌 Appium 실제 디바이스 및 플랫폼 설정 정의
 * Date : 2025-04-11
 */
import type { DeviceConfig } from '@common/types/device-config.js';
import { devices } from '@playwright/test';
import path from 'path';

// 자사 App APK 경로
const apkPath = path.resolve(
  // aapt dump badging "apk파일"
  process.cwd(),
  'apk 파일 이름',
);
/**
 * ChromeDriver 경로
 */
const CHROMEDRIVER_PATH = path.resolve(
  process.cwd(),
  'common/assets/driver/138.0.7204.92/chromedriver',
);

/**
 * PC 기기 정의 (13인치 / 15인치)
 */
export const PC_DEVICES: Record<string, DeviceConfig> = {
  '13-inch': {
    platformName: 'PC',
    deviceName: 'Desktop 13-inch',
    browserName: 'chromium',
    ['appium:options']: undefined,
    udid: '',
    platformVersion: '',
    app: '',
  },
  '15-inch': {
    platformName: 'PC',
    deviceName: 'Desktop 15-inch',
    browserName: 'chromium',
    ['appium:options']: undefined,
    udid: '',
    platformVersion: '',
    app: '',
  },
};

/**
 * Android 기기
 */
export const ANDROID_DEVICES: Record<string, DeviceConfig> = {
  // 리그레이션 전용 기기
  'Galaxy ZFilp4': {
    platformName: 'Android',
    deviceName: 'Galaxy ZFilp4',
    udid: 'udid',
    platformVersion: '14',
    appPackage: '번들아이디',
    appActivity: '번들아이디.activity.main.MainActivity',
    appium: {
      options: {
        udid: 'R3CTA081TAW',
        platformVersion: '14',
        appActivity: '번들아이디.activity.main.MainActivity',
        appPackage: '번들아이디',
        automationName: 'UiAutomator2',
        noReset: true,
        autoLaunch: true,
        dontStopAppOnReset: true,
        appWaitDuration: 30000,
        newCommandTimeout: 1800,
        chromedriverExecutable: CHROMEDRIVER_PATH,
      },
    },
  },
};

/**
 * iOS 기기
 */
export const IOS_DEVICES: Record<string, DeviceConfig> = {
  // 리그레이션 전용 기기
  'iPhone 12 Pro Max': {
    platformName: 'iOS',
    deviceName: 'iPhone 12 Pro Max',
    udid: 'udid',
    platformVersion: '18.1.1',
    appium: {
      options: {
        udid: 'udid',
        platformVersion: '18.1.1',
        bundleId: '번들아이디',
        automationName: 'XCUITest',
        wdaStartupRetryInterval: 10000, // 더 짧게
        waitForIdleTimeout: 3000,
        dontStopAppOnReset: true,
        noReset: true,
        appWaitDuration: 60000, // 60초까지 늘려도 좋음
        newCommandTimeout: 300,
        skipUnlock: false,
      },
    },
  },
};

export const BASE_EMULATOR_DEVICES = {
  // 에뮬레이션 Android 기기
  'android-emulator': {
    name: 'Android Emulator App',
    device: devices['Pixel 5'],
    config: {
      platformName: 'Android',
      deviceName: 'Android Emulator',
      appium: {
        options: {
          udid: '',
          platformVersion: '13',
          appActivity: '번들아이디.activity.main.MainActivity',
          appPackage: '번들아이디',
          app: process.env.ANDROID_EMULATOR_APP_PATH ?? '/path/to/android/emulator/app.apk',
          automationName: 'UiAutomator2',
          autoLaunch: true,
          dontStopAppOnReset: true,
          newCommandTimeout: 1800,
        },
      },
    },
  },
} as const;

// 테스트 전용 기기
export const BASE_DEVICES = {
  pc: {
    name: 'Desktop Chrome',
    device: devices['Desktop Chrome'],
  },
  mw: {
    name: 'Mobile Chrome',
    device: devices['galaxy note 20 ultra'],
  },
  aos: [
    {
      name: 'GalaxyTest',
      device: devices['GalaxyTest'],
      config: ANDROID_DEVICES['GalaxyTest'],
    },
    {
      name: 'Android Emulator App',
      device: devices['Pixel 5'],
      config: BASE_EMULATOR_DEVICES['android-emulator'].config,
    },
  ],
  ios: [
    {
      name: 'iPhone 12 Pro Max',
      device: devices['iPhone 12'],
      config: IOS_DEVICES['iPhone 12 Pro Max'],
    },
  ],
  api: {
    name: 'API Only',
  },
} as const;

// 현재 실행 디바이스 정보 (환경변수 기반)
export const ANDROID_DEVICE = process.env.ANDROID_DEVICE || 'Galaxy ZFilp4';
export const IOS_DEVICE = process.env.IOS_DEVICE || 'iPhone 12 Pro Max';

export const CURRENT_ANDROID_CONFIG: DeviceConfig =
  ANDROID_DEVICES[ANDROID_DEVICE] || ANDROID_DEVICES['Galaxy ZFilp4'];
export const CURRENT_IOS_CONFIG: DeviceConfig =
  IOS_DEVICES[IOS_DEVICE] || IOS_DEVICES['iPhone 12 Pro Max'];

// 실제 테스트 연결 기기 최대 수
export const MAX_REAL_DEVICES = parseInt(process.env.MAX_REAL_DEVICES || '2', 10);
