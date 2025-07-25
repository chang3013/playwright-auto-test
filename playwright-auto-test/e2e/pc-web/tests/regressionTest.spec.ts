import { test, createStealthPage } from '@common/fixtures/BaseWebFixture.js';
import { LoginSteps } from '@e2e/pc-web/src/steps/LoginStep.js';
import { MainSteps } from '@e2e/pc-web/src/steps/MainStep.js';
import { SearchSteps } from '@e2e/pc-web/src/steps/SearchStep.js';
import { MySteps } from '@e2e/pc-web/src/steps/MyStep.js';
import { MobileSteps } from '@e2e/pc-web/src/steps/MobileStep.js';
import { IptvSteps } from '@e2e/pc-web/src/steps/IptvStep.js';
import { BenefitSteps } from '@e2e/pc-web/src/steps/BenefitStep.js';
import { NergetSteps } from '@e2e/pc-web/src/steps/NergetStep.js';
import { SupportSteps } from '@e2e/pc-web/src/steps/SupportStep.js';
import { UjamSteps } from '@e2e/pc-web/src/steps/UjamStep.js';
import { UdocSteps } from '@e2e/pc-web/src/steps/UdocStep.js';
import type { BrowserContext, Page } from '@playwright/test';
import 'dotenv/config';

test.describe.configure({ mode: 'serial' });

test.describe('Regression Test', () => {
  const testResults: boolean[] = [];

  let context: BrowserContext;
  let page: Page;
  let main: MainSteps;
  let search: SearchSteps;
  let my: MySteps;
  let mobile: MobileSteps;
  let iptv: IptvSteps;
  let benefit: BenefitSteps;
  let support: SupportSteps;
  let nerget: NergetSteps;
  let ujam: UjamSteps;
  let udoc: UdocSteps;

  test.beforeAll(async () => {
    const stealth = await createStealthPage();
    context = stealth.context;
    page = stealth.page;

    const login = new LoginSteps(page);
    const id = process.env.UPLUS_ID!;
    const pw = process.env.UPLUS_PW!;
    await login.doUplusLoginTest(id, pw);

    main = new MainSteps(page);
    search = new SearchSteps(page);
    my = new MySteps(page);
    mobile = new MobileSteps(page);
    iptv = new IptvSteps(page);
    benefit = new BenefitSteps(page);
    support = new SupportSteps(page);
    nerget = new NergetSteps(page);
    ujam = new UjamSteps(page);
    udoc = new UdocSteps(page);
  });

  test.afterAll(async () => {
    const result = testResults.every(result => result === true);

    if (result) {
      console.log(`테스트 결과: PASS`)
    } else {
      console.log(`테스트 결과: FAIL`)
      console.log(`testResults: ${testResults}`)
    }

    await page.close();
    await context.close();
  });

  test('메인페이지', async () => {
    testResults.push(await main.mainTest());
  });

  test('메인페이지 개인화 영역', async () => {
    testResults.push(await main.mainMyTest());
  });

  test('검색페이지', async () => {
    testResults.push(await search.searchTest());
  });

  test('마이페이지 서브메인', async () => {
    testResults.push(await my.myTest());
  });

  test('마이페이지 요금/납부', async () => {
    testResults.push(await my.myBillTest());
  });

  test('마이페이지 사용내역 조회', async () => {
    testResults.push(await my.myUseTest());
  });

  test('모바일 서브메인', async () => {
    testResults.push(await mobile.mobileTest());
  });

  test('모바일 장바구니', async () => {
    testResults.push(await mobile.mobileCartTest());
  });

  test('모바일 요금제 서브메인', async () => {
    testResults.push(await mobile.mobilePlanTest());
  });

  test('모바일 요금제 변경', async () => {
    testResults.push(await mobile.mobilePlanChangeTest());
  });

  test('모바일 요금제 비교', async () => {
    testResults.push(await mobile.mobilePlanCompareTest());
  });

  test('인터넷/IPTV 서브메인', async () => {
    testResults.push(await iptv.iptvTest());
  });

  test('혜택/멤버십 서브메인', async () => {
    testResults.push(await benefit.benefitTest());
  });

  test('멤버십 이용내역', async () => {
    testResults.push(await benefit.membershipTest());
  });

  test('고객지원', async () => {
    testResults.push(await support.supportTest());
  });

  test('너겟', async () => {
    testResults.push(await nerget.nergetTest());
  });

  test('유잼', async () => {
    testResults.push(await ujam.ujamTest());
  });

  test('유독', async () => {
    testResults.push(await udoc.udocTest());
  });
});
