/**
 * Description : PathConstants.ts - 📌 POC 타입 정의와 경로 매핑, 파일명 관련 로직 정의
 */
// 타임스탬프 포맷터 유틸
import { getFormattedDate } from '@common/formatters/formatters.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 파일 위치 기준 디렉토리 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 프로젝트 루트 경로
export const BASE_PATH = path.resolve(__dirname, '../..');

/**
 * 각 POC별 실제 테스트 디렉토리 매핑
 */
export const POC_FOLDER_MAP = {
  pc: 'pc-web',
  mw: ['pc-mobile-web'],
  aos: ['android-app'],
  ios: ['ios-app'],
  api: 'api',
} as const;

/**
 * 모바일 웹 (MW) 브라우저 디렉토리 - 브라우저 이름 매핑
 */
export const MW_BROWSER_MAP: Record<string, string> = {
  'pc-mobile-web': 'pc-mobile-chrome',
  'android-mobile-web': 'android-mobile-chrome',
  'ios-mobile-web': 'ios-mobile-safari',
};

/**
 * 안드로이드 브라우저 매핑
 */
export const AND_BROWSER_MAP: Record<string, string> = {
  'android-app': 'android-app',
  'android-emulator-app': 'android-emulator-app',
};

/**
 * iOS 브라우저 매핑
 */
export const IOS_BROWSER_MAP: Record<string, string> = {
  'ios-app': 'ios-app',
  'ios-emulator-app': 'ios-emulator-app',
};

/**
 * POC에 따른 테스트 실행 경로(e2e/*) 리스트 반환
 * - ALL인 경우 전체 POC에 대한 경로를 반환
 */
export const POC_PATH = (poc: string): string[] => {
  // ALL 처리: 모든 POC value 기준으로 실행
  if (poc.toLowerCase() === 'all') {
    return POCEnv.getPOCList()
      .flatMap(value => {
        const normalized = value.toLowerCase();
        const folders = POC_FOLDER_MAP[normalized as keyof typeof POC_FOLDER_MAP];
        return Array.isArray(folders) ? folders : [folders];
      })
      .map(folder => `${BASE_PATH}/e2e/${folder}`);
  }

  // 단일 POC 처리
  const normalized = poc.toLowerCase();
  const folders = POC_FOLDER_MAP[normalized as keyof typeof POC_FOLDER_MAP];
  if (!folders) {
    throw new Error(`[POC_PATH] '${poc}'에 대한 경로가 POC_FOLDER_MAP에 정의되어 있지 않습니다.`);
  }

  return Array.isArray(folders)
    ? folders.map(f => `${BASE_PATH}/e2e/${f}`)
    : [`${BASE_PATH}/e2e/${folders}`];
};

/**
 * 특정 서브디렉토리를 포함한 경로 반환
 * ex) src/components, tests, etc...
 */
export const getPOCPathWithSubdir = (poc: string, subPath: string): string[] => {
  return POC_PATH(poc).map(base => `${base}/${subPath}`);
};

/**
 * 디렉토리 텍스트 반환
 *
 * onlyDir: true인 경우 폴더 경로까지만 반환
 *
 * onlyDir: false인 경우 파일명까지 반환
 */
const mapToTimestampedPath = (
  basePaths: string[],
  fileName: string,
  onlyDir: boolean = false,
): string[] => basePaths.map(p => (onlyDir ? p : `${p}/${fileName}`));

/**
 * 테스트 실행 시 생성되는 결과 리포트 경로 모음
 */
export const POC_RESULT_PATHS = (poc: string) => ({
  playwrightReport: getPOCPathWithSubdir(poc, 'playwright-report'),
  coverage: getPOCPathWithSubdir(poc, 'coverage'),
  log: getPOCPathWithSubdir(poc, 'test-results/logs'),
  allureResult: getPOCPathWithSubdir(poc, 'test-results/allure-results'),
  screenshots: getPOCPathWithSubdir(poc, 'test-results/screenshots'),
  videos: getPOCPathWithSubdir(poc, 'test-results/videos'),
  traces: getPOCPathWithSubdir(poc, 'test-results/traces'),
});

/**
 * 테스트 코드/리소스 위치 반환 (pages, steps 등)
 */
export const FOLDER_PATHS = (poc: string) => ({
  locators: '/common/locators',
  components: getPOCPathWithSubdir(poc, 'src/components'),
  constants: getPOCPathWithSubdir(poc, 'src/constants'),
  fixtures: getPOCPathWithSubdir(poc, 'src/fixtures'),
  tests: getPOCPathWithSubdir(poc, 'tests'),
  pages: getPOCPathWithSubdir(poc, 'src/pages'),
  steps: getPOCPathWithSubdir(poc, 'src/steps'),
  docker: getPOCPathWithSubdir(poc, 'src/Dockerfile'),
});

/**
 * 테스트 결과 파일 이름 자동 생성 (timestamp 포함)
 */
export const TEST_RESULT_FILE_NAME = (
  poc: string,
): Record<keyof ReturnType<typeof POC_RESULT_PATHS>, string[]> => {
  const date = getFormattedDate();
  const paths = POC_RESULT_PATHS(poc);

  return {
    playwrightReport: mapToTimestampedPath(paths.playwrightReport, `${poc}_report_${date}.html`),
    // allureResult: mapToTimestampedPath(paths.allureResult, `${poc}_allure-result_${date}.json`),
    allureResult: mapToTimestampedPath(paths.allureResult, '', true),
    log: mapToTimestampedPath(paths.log, '', true),
    screenshots: mapToTimestampedPath(paths.screenshots, '', true),
    videos: mapToTimestampedPath(paths.videos, '', true),
    traces: mapToTimestampedPath(paths.traces, '', true),
    coverage: mapToTimestampedPath(paths.coverage, '', true),
  };
};
