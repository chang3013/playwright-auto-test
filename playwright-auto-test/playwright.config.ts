import { ANDROID_DEVICES, BASE_DEVICES, IOS_DEVICES } from '@common/config/deviceConfig.js';
import {
  AND_BROWSER_MAP,
  IOS_BROWSER_MAP,
  MW_BROWSER_MAP,
  TEST_RESULT_FILE_NAME,
} from '@common/constants/PathConstants.js';
import type { E2EProjectConfig } from '@common/types/playwright-config.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import { defineConfig, devices, type Project } from '@playwright/test';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';
import { dirname } from 'path';
import 'tsconfig-paths/register.js';
import { fileURLToPath } from 'url';
import type winston from 'winston';

// ESM 환경 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, '.env') });

// 현재 POC 환경 정보 출력
const pocList = (() => {
  try {
    return POCEnv.getPOCList();
  } catch {
    return POCEnv.getAllPOCValues();
  }
})();
POCEnv.printPOCInfo();

// 브라우저 조합 동적 생성
const browserMatrix: Record<string, string[]> = {
  // pc-web: ['chrome', 'firefox', 'safari', 'edge']
  PC: ['pc-chrome'],
  // pc-mobile-web, device-mobile-web, emulate-mobile-web: ['chrome', 'safari']
  MW: Object.values(MW_BROWSER_MAP),
  // android-app
  AOS: Object.values(AND_BROWSER_MAP),
  // ios-app
  IOS: Object.values(IOS_BROWSER_MAP),
  API: [],
  ALL: [],
};

// ALL에 나머지 POC의 모든 브라우저/디바이스를 병합해서 넣기
browserMatrix.ALL = [
  ...new Set(
    Object.entries(browserMatrix)
      .filter(([key]) => key !== 'ALL')
      .flatMap(([, value]) => value),
  ),
];

// POC 별 테스트 프로젝트 정의
const pocProjects: Project[] = pocList.flatMap(poc => {
  const deviceInfo = BASE_DEVICES[poc as keyof typeof BASE_DEVICES];
  // 테스트 결과 파일 경로 (파일명 포함)
  // const resultFilePaths = TEST_RESULT_FILE_NAME(poc);
  const browsers = browserMatrix[poc];
  // 디바이스 정보가 없거나 브라우저가 없으면 빈 배열 반환
  if (!deviceInfo || !browsers) return [];

  // device 필드 또는 device 배열 요소에서 Playwright 디바이스 추출
  let resolvedDevice: any;
  if (Array.isArray(deviceInfo)) {
    resolvedDevice = deviceInfo[0]?.device;
  } else if ('device' in deviceInfo) {
    resolvedDevice = deviceInfo.device;
  } else {
    resolvedDevice = undefined;
  }

  return browsers.map(browser => {
    const label = browser.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    // 기본 환경 설정 (Global Configuration)
    const useOptions = {
      ...(resolvedDevice ?? {}),
      /**
       * 브라우저 실행 모드 설정:
       * - process.env.HEADLESS=true - 브라우저 headless 모드
       * - process.env.HEADLESS=false - 브라우저 UI 표시
       */
      headless: process.env.HEADLESS !== 'false',
      /* Base URL to use in actions like `await page.goto('/')`. */
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      // 기본 화면 크기 설정
      viewport: resolvedDevice?.viewport ?? { width: 1920, height: 1080 },
      // 테스트 실패 시만 스크린샷 저장
      screenshot: 'only-on-failure',
      // 실패한 테스트의 경우에만 비디오 녹화 유지
      video: 'retain-on-failure',
      /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      // 첫 번째 재시도에서 trace 파일 저장
      trace: 'on-first-retry',
      ignoreHTTPSErrors: true,
      // HTTPS 인증서 오류 무시 (보안 경고 무시)
      acceptDownloads: true,
      // 브라우저 실행 타임아웃 (기본값: 60000ms)
      timeout: parseInt(process.env.BROWSER_LAUNCH_TIMEOUT ?? '60000', 10),
      // 슬로우 모션 (기본값: 0ms)
      slowMo: parseInt(process.env.SLOW_MO ?? '0', 10),
      // 단일 액션 타임아웃 (초 단위 → ms 변환)
      actionTimeout: parseInt(process.env.ACTION_TIMEOUT ?? '30', 10) * 1000,
      // 페이지 이동 타임아웃 (초 단위 → ms 변환)
      navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT ?? '60', 10) * 1000,
      // 콘솔 로그 캡처
      logger: {
        isEnabled: (name: string, severity: string) => ['error', 'warning'].includes(severity),
        log: (name: string, severity: string, message: string) =>
          console.log(`[${severity}] ${name}: ${message}`),
      },

      /**
       * 브라우저 실행 시 추가 옵션 (arguments)
       * - `--start-maximized`         : 브라우저 최대화
       * - `--disable-extensions`      : 브라우저 확장프로그램 비활성화
       * - `--disable-plugins`         : 브라우저 플러그인 비활성화
       * - `--disable-dev-shm-usage`   : 공유 메모리(/dev/shm)사용 비활성화
       * - `--no-sandbox`              : 샌드박스 비활성화(일부 CI/CD 환경에서 필수)
       * - `--disable-gpu`             : GPU 가속 비활성화(CI 환경에서 렌더링 최적화)
       * - `--disable-blink-features=AutomationControlled`: Selenium 등 자동화 탐지를 피하기 위한 설정
       */
      args:
        browser === 'edge'
          ? [
              '--no-sandbox',
              '--disable-gpu',
              '--disable-blink-features=AutomationControlled',
              '--window-size=1280,720',
            ]
          : [
              '--start-maximized',
              '--disable-extensions',
              '--disable-plugins',
              '--disable-dev-shm-usage',
              '--no-sandbox',
              '--disable-gpu',
              '--disable-blink-features=AutomationControlled',
            ],
    };

    return {
      name: `POC - ${poc} - ${label}`,
      testMatch: [`**/${browser}/src/steps/**/*.spec.ts`],
      /* Reporter to use. See https://playwright.dev/docs/test-reporters */
      // 테스트 리포트 설정 (Reporter Configuration)
      // reporter: [
      //   ['list'],
      //   ['html', { outputFolder: resultFilePaths.playwrightReport[0], open: 'never' }],
      //   ['json', { outputFile: resultFilePaths.log[0] }],
      //   ['allure-playwright', { outputFolder: resultFilePaths.allureResult[0] }],
      // ],
      use: useOptions,
    };
  });
});

const E2E_CONFIGS: E2EProjectConfig[] = [
  // PC Web - Chrome
  {
    name: 'E2E-PC',
    path: 'e2e/pc-web',
    device: 'Desktop Chrome',
    viewport: { width: 1920, height: 1080 },
    launchOptions: {
      slowMo: 100,
      devtools: true,
      args: ['--start-maximized', '--start-fullscreen'],
    },
    outputKey: 'pc',
  },
  // PC Mobile Web - Chrome
  {
    name: 'E2E-MW',
    path: 'e2e/pc-mobile-web',
    device: 'Desktop Chrome',
    viewport: { width: 412, height: 915 },
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
    launchOptions: {
      args: ['--start-maximized', '--start-fullscreen'],
      slowMo: 100,
      devtools: true,
    },
    contextOptions: {
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 3.5,
    },
    outputKey: 'mw',
  },
  // 갤럭시 노트20 울트라 기기로 android-app 테스트
  ...Object.entries(ANDROID_DEVICES)
    .filter(([name]) => name === 'Galaxy Note20 Ultra')
    .map(([name, config]) => ({
      name: 'E2E-AOS',
      path: 'e2e/android-app',
      device: name,
      deviceConfig: config,
      outputKey: 'aos',
    })),
  // 갤럭시 노트20 울트라 기기로 speedtest 테스트
  ...Object.entries(ANDROID_DEVICES)
    .filter(([name]) => name === 'Galaxy Note20 Ultra')
    .map(([name, config]) => ({
      name: 'SPEEDTEST',
      path: 'speedtest',
      device: name,
      deviceConfig: config,
      outputKey: 'aos',
    })),
  ...Object.entries(ANDROID_DEVICES)
    .filter(([name]) => name === 'Galaxy ZFilp4')
    .map(([name, config]) => ({
      name: 'E2E-AOS',
      path: 'e2e/android-app',
      device: name,
      deviceConfig: config,
      outputKey: 'aos',
    })),
  ...Object.entries(ANDROID_DEVICES)
    .filter(([name]) => name === 'Galaxy S23')
    .map(([name, config]) => ({
      name: 'E2E-AOS',
      path: 'e2e/android-app',
      device: name,
      deviceConfig: config,
      outputKey: 'aos',
    })),
  // iOS App - LGUPLUS
  ...Object.entries(IOS_DEVICES)
    .filter(([name]) => name === 'iPhone 12 Pro Max')
    .map(([name, config]) => ({
      name: 'E2E-IOS',
      path: 'e2e/ios-app',
      device: name,
      deviceConfig: config,
      outputKey: 'ios',
    })),
];

// E2E 테스트 프로젝트 변환
function generateE2EProjects(): Project[] {
  // POC 소문자로 처리
  const poc = process.env.POC?.toLowerCase();

  return E2E_CONFIGS.filter(config => {
    if (!config.platform || config.platform.includes(process.platform)) {
      if (!poc || poc === 'all') return true;
      return config.outputKey === poc;
    }
  }).map(config => {
    // const resultPaths = TEST_RESULT_FILE_NAME(config.outputKey);
    return {
      name: `${config.name}`,
      testMatch: [`**/${config.path}/**/**.spec.ts`],
      use: {
        ...devices[config.device],
        headless: process.env.HEADLESS !== 'false',
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        viewport: config.viewport,
        userAgent: config.userAgent,
        slowMo: config.launchOptions?.slowMo,
        devtools: config.launchOptions?.devtools,
        args: config.launchOptions?.args,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
      },
      // reporter: [
      //   ['list'],
      //   ['html', { outputFolder: resultPaths.playwrightReport[0], open: 'never' }],
      //   ['json', { outputFile: resultPaths.log[0] }],
      //   ['allure-playwright', { outputFolder: resultPaths.allureResult[0] }],
      // ],
    };
  });
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// 최종 설정 export
export default defineConfig({
  // 공통 초기화 작업
  globalSetup: path.resolve(__dirname, './GlobalSetup.ts'),
  // 공통 종료 작업
  globalTeardown: path.resolve(__dirname, './GlobalTeardown.ts'),
  // 공통 테스트 폴더 경로
  testDir: '.',
  testMatch: ['**/*.spec.ts', '**/src/steps/**/*.ts', 'e2e/**/*.spec.ts'],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // 테스트 실행 시 동시 실행할 워커(worker) 수 설정 : 로컬은 CPU 75% 사용
  workers: process.env.CI ? 1 : Math.max(1, Math.floor(os.cpus().length * 0.75)),
  // 타임아웃 설정 (30분)
  timeout: 30 * 60 * 1000,
  /* Configure projects for major browsers */
  // 테스트 프로젝트별 설정 (Test Project Configuration)
  projects: [...generateE2EProjects(), ...(pocProjects.length ? pocProjects : [])],
  /* Run your local dev server before starting the tests */
  // 로컬 개발 서버 설정 (Local Dev Server Configuration)
  webServer:
    process.env.START_WEB_SERVER === 'true'
      ? {
          command: 'npm run start',
          url: 'http://localhost:3000',
          reuseExistingServer: true,
          ignoreHTTPSErrors: true,
        }
      : undefined,
});

// 테스트 프로젝트 콘솔 출력
if (process.env.DEBUG_PROJECTS === 'true') {
  console.log(
    'Generated Projects:',
    [...generateE2EProjects(), ...pocProjects].map(p => p.name),
  );
}
