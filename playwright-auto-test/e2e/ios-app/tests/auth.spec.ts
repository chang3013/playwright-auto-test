/**
 * Description : auth.spec.ts - IOS Full Regression 케이스
 * Date : 2025-06-11
 */
import { AppActions } from '@common/actions/AppActions.js';
import { test } from '@common/fixtures/BaseAppFixture.js';
import { authLocator } from '@common/locators/authLocator.js';
import { BenefitSteps } from '@e2e/ios-app/src/steps/BenefitSteps.js';
import { IptvSteps } from '@e2e/ios-app/src/steps/IptvSteps.js';
import { LoginSteps } from '@e2e/ios-app/src/steps/LoginSteps.js';
import { MainSteps } from '@e2e/ios-app/src/steps/MainSteps.js';
import { MobileCartSteps } from '@e2e/ios-app/src/steps/MobileCartSteps.js';
import { MobilePlanSteps } from '@e2e/ios-app/src/steps/MobilePlanSteps.js';
import { MobileSteps } from '@e2e/ios-app/src/steps/MobileSteps.js';
import { MySteps } from '@e2e/ios-app/src/steps/MySteps.js';
import { NergetSteps } from '@e2e/ios-app/src/steps/NergetSteps.js';
import { SearchSteps } from '@e2e/ios-app/src/steps/SearchSteps.js';
import { SupportSteps } from '@e2e/ios-app/src/steps/SupportSteps.js';
import { UdocSteps } from '@e2e/ios-app/src/steps/UdocSteps.js';
import { UjamSteps } from '@e2e/ios-app/src/steps/UjamSteps.js';
import { expect } from '@playwright/test';
import 'dotenv/config';
import type { Browser as WDIOBrowser } from 'webdriverio';

let driver: WDIOBrowser;
let actions: AppActions;
const id = process.env.UPLUS_ID!;
const pw = process.env.UPLUS_PW!;

test.setTimeout(30 * 60 * 1000);
test.describe.serial('[iOS] Full Regression ', () => {
  const testResults: boolean[] = [];
  test.beforeAll(async ({ appDriver, poc }) => {
    driver = appDriver;
    actions = new AppActions(appDriver);
    actions.isDelay();
    //await driver.pause(1000);
    //로그인 없이 할떄 웹뷰 전환 필요
    await actions.switchToWebViewByUrlSafe(authLocator.appUrl);
  });
  /**
   * TC1
   */
  test('LG UPLUS 2.0 로그인', async () => {
    await actions.isDelay();
    const loginBox = await actions.switchToWebViewByUrlSafe(authLocator.authUrl);
    if (loginBox) {
      console.log('비로그인 상태 로그인 테스트 수행');
      const login = new LoginSteps(driver);
      testResults.push(await login.loginTest(id, pw));
      await actions.isDelay();
    } else {
      console.log('자동로그인 상태로 로그인 Skip');
    }
  });
  /**
   * TC2
   */
  test('LG UPLUS 2.0 로그아웃', async () => {
    console.log('로그아웃 테스트 수행');
    const login = new LoginSteps(driver);
    testResults.push(await login.logoutTest());
  });
  /**
   * TC3
   */
  test('재로그인', async () => {
    console.log('재로그인 테스트 수행');
    const login = new LoginSteps(driver);
    testResults.push(await login.reLoginTest(id, pw));
    await actions.isDelay();
  });
  /**
   * TC4
   */
  test('메인', async () => {
    await actions.isDelay();
    console.log('메인 수행');
    const main = new MainSteps(driver);
    testResults.push(await main.mainCase());
  });
  /**
   * TC5
   */
  test('메인 로그인 후 개인화 영역 확인', async () => {
    await actions.isDelay();
    console.log('메인 로그인 후 개인화 영역 수행');
    const main = new MainSteps(driver);
    testResults.push(await main.mainMyUsedCase());
  });
  /**
   * TC6
   */
  test('검색 기능', async () => {
    await actions.isDelay();
    console.log('검색 테스트 수행');
    const search = new SearchSteps(driver);
    testResults.push(await search.searchCase());
  });
  /**
   * TC7
   */
  test('마이페이지 서브메인', async () => {
    await actions.isDelay();
    console.log('마이페이지 수행');
    const my = new MySteps(driver);
    testResults.push(await my.mySubMainCase());
  });
  /**
   * TC8
   */
  test('마이페이지 요금/납부', async () => {
    await actions.isDelay();
    console.log('마이페이지 요금/납부 수행');
    const my = new MySteps(driver);
    testResults.push(await my.myBillsCase());
  });
  /**
   * TC9
   */
  test('마이페이지 사용내역', async () => {
    await actions.isDelay();
    console.log('마이페이지 사용내역');
    const my = new MySteps(driver);
    testResults.push(await my.myUseCase());
  });
  /**
   * TC10
   */
  test('모바일 서브메인', async () => {
    await actions.isDelay();
    console.log('모바일 서브메인');
    const mobile = new MobileSteps(driver);
    testResults.push(await mobile.mobileSubCase());
  });
  /**
   * TC11
   */
  test('모바일 장바구니', async () => {
    await actions.isDelay();
    console.log('모바일 장바구니');
    const mobile = new MobileSteps(driver);
    testResults.push(await mobile.mobileCartCase());
  });
  /**
   * TC12
   */
  test('모바일 요금제', async () => {
    await actions.isDelay();
    console.log('모바일 요금제');
    const mobile = new MobileSteps(driver);
    testResults.push(await mobile.mobilePlanCase());
  });
  /**
   * TC13
   */
  test('IPTV', async () => {
    await actions.isDelay();
    console.log('IPTV 수행');
    const iptv = new IptvSteps(driver);
    testResults.push(await iptv.iptvCase());
  });
  /**
   * TC14
   */
  test('혜택(베네핏)', async () => {
    await actions.isDelay();
    console.log('혜택(베네핏) 수행');
    const benefit = new BenefitSteps(driver);
    testResults.push(await benefit.benefitCase());
  });
  /**
   * TC15
   */
  test('멤버십 기능', async () => {
    await actions.isDelay();
    console.log('멤버십 수행');
    const benefit = new BenefitSteps(driver);
    testResults.push(await benefit.membershipCase());
  });
  /**
   * TC16
   */
  test('고객지원 기능', async () => {
    await actions.isDelay();
    console.log('고객지원(서프트) 수행');
    const support = new SupportSteps(driver);
    testResults.push(await support.supportCase());
  });
  /**
   * TC17
   */
  test('너겟', async () => {
    await actions.isDelay();
    console.log('너겟 수행');
    const nerget = new NergetSteps(driver);
    testResults.push(await nerget.nergetCase());
  });
  /**
   * TC18
   */
  test('유잼', async () => {
    console.log('유잼 테스트 수행');
    await actions.isDelay();
    const ujam = new UjamSteps(driver);
    testResults.push(await ujam.ujamCase());
  });
  /**
   * TC19
   */
  test('유독', async () => {
    console.log('유독 테스트 수행');
    const udoc = new UdocSteps(driver);
    testResults.push(await udoc.udocCase());
    await actions.isDelay();
  });

  test.afterAll(async ({ appDriver }) => {
    console.log(testResults);
    const result = testResults.every(result => result === true);

    if (result) {
      console.log(`테스트 결과: PASS`);
    } else {
      console.log(`테스트 결과: FAIL`);
      console.log(`testResults: ${testResults}`);
    }
    // await appDriver.terminateApp(process.env.BUNDLE_ID as string, { timeout: 1000 });
  });
});
