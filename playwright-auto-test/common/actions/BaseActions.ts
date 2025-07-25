import { JsForceActions } from '@common/actions/JsForceActions.js';
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { uiLocator } from '@common/locators/uiLocator';
import { urlLocator } from '@common/locators/urlLocator';
import { Platform, UIType } from '@common/types/platform-types.js';
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export abstract class BaseActions<TDriver = unknown> extends BasePocFixture {
  // Mobile 처리를 위해 일단은 부분적으로 page 를 받도록 처리
  public page?: Page;
  public js?: JsForceActions;
  protected platform: Platform;
  protected uiType: UIType;
  // driver?: TDriver; // Appium 드라이버 객체
  // driver는 Mobile 에서만 필요하므로 MobileActionUtils 에서 처리하도록 함
  constructor(page?: Page, driver?: TDriver) {
    super();
    if (page) this.page = page;
  }

  // ========== Common ==========
  /**
   * Playwright Page 객체를 런타임에 설정 (웹뷰 전환 시 사용)
   */
  public setPlaywrightPage(page: Page): void {
    this.page = page;
    this.js = new JsForceActions(page);
  }

  /**
   *  Common: 페이지 설정
   */
  protected ensurePage(): Page {
    if (!this.page) throw new Error('WebView Page가 설정되지 않았습니다.');
    return this.page;
  }

  /**
   *  Common: 자바스크립트 Action Utils 설정
   */
  protected ensureJs(): JsForceActions {
    if (!this.js) throw new Error('js가 설정되지 않았습니다.');
    return this.js;
  }

  // ========== Playwright 전용 ==========

  /**
   * Playwright에서 요소를 찾는 안전한 헬퍼 함수
   */
  protected getLocator(selector: string): Locator {
    return this.ensurePage().locator(selector);
  }

  /**
   *  요소가 보일 때까지 대기
   */
  public async waitForVisible(selector: string, timeout = 5000): Promise<void> {
    await this.getLocator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   *  요소 클릭
   */
  public async click(target: string | Locator, evalu: boolean=true): Promise<void> {
    const page = this.ensurePage();
    let locator: Locator;

    try {
      if (typeof target === 'string') {
        await this.waitSelector(target, 10000); // target이 string일 경우, 존재할 때까지 대기
        locator = await this.getLocator(target);
      } else {
        locator = target;
      }

      if (evalu) {
        await locator.evaluate((el: Element) => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      });
      }

      await this.waitTime(1);
      await locator.click({ timeout: 10000 });
      await this.waitTime(1);
    } catch (error) {
      throw new Error(
        `[click] 클릭 실패\n요소: ${typeof target === 'string' ? target : 'Locator 객체'}\nERROR: ${error}`,
      );
    }
  }

  /**
   * 텍스트 입력 - 한 글자씩 (랜덤 delay)
   */
  public async typeTextSlowly(
    selector: string,
    text: string,
    baseDelayMs = 100,
    randomize = true,
  ): Promise<void> {
    const locator = this.getLocator(selector);
    await locator.click();
    await locator.fill('');

    for (const char of text) {
      await this.ensurePage().keyboard.press(char);
      const delay = randomize ? baseDelayMs + Math.floor(Math.random() * 100) : baseDelayMs;
      await this.ensurePage().waitForTimeout(delay);
    }
  }

  /**
   *  텍스트 포함된 요소 찾기
   */
  public async findElementWithText(selector: string, text: string): Promise<Locator> {
    return this.ensurePage().locator(selector, { hasText: text });
  }

  /**
   * 요소가 존재하면 클릭
   */
  public async clickIfExists(target: string | Locator): Promise<void> {
    const page = this.ensurePage();
    let locator: Locator;

    try {
      if (typeof target === 'string') {
        try {
          await page.waitForSelector(target, { timeout: 10000 });
        } catch {
          return;
        }
        locator = await this.getLocator(target);
      } else {
        locator = target;
      }

      if (await locator.count() === 0) {
        return;
      } else {
        await locator.evaluate((el: Element) => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        });
        await this.waitTime(1);
        await locator.click({ timeout: 10000 });
        await this.waitTime(1);
      }
    } catch (error) {
      throw new Error(
        `[clickIfExists] 클릭 실패\n요소: ${typeof target === 'string' ? target : 'Locator 객체'}\nERROR: ${error}`,
      );
    }
  }

  /**
   * 요소를 화면 중앙으로 스크롤
   */
  public async scrollToCenter(selector: string): Promise<void> {
    await this.ensurePage().evaluate(sel => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ block: 'center', behavior: 'auto' });
    }, selector);
  }

  /**
   * 요소를 화면 뷰 안으로 스크롤합니다.
   */
  public async scrollElementIntoView(
    target: string | Locator,
    alignToTop: boolean = true,
  ): Promise<void> {
    const locator = typeof target === 'string' ? this.ensurePage().locator(target) : target;
    const handle = await locator.elementHandle();

    if (handle) {
      await handle.evaluate((el, align) => {
        el.scrollIntoView(align);
      }, alignToTop);
    }
  }

  /**
   * 모달 닫기 버튼 리스트
   */
  private readonly modalCloseLocators = uiLocator.modalCloseButtonList;

  /**
   * 공통 팝업(모달, 인터스티셜) 닫기
   */
  async checkCommonModals(): Promise<void> {
    try {
      const modal = await this.isModalOpen();
      // modal 열려있으면 5회까지 닫기 버튼 클릭 반복
      for (let i = 0; i < 5; i++) {
        if (!modal) return;
        // modal/ins 닫기 버튼 리스트
        const locators = this.modalCloseLocators.map(selector => this.getLocator(selector).first());
        const closeButtons: Locator[] = [];

        for (const btn of locators) {
          if (await btn.isVisible() && await btn.isEnabled()) {
            closeButtons.push(btn);
          }
        }

        await this.waitTime(1);
        // 닫기 버튼이 없으면 그냥 넘어감
        if (closeButtons.length === 0) {
          console.warn('[checkCommonModals] 닫기 버튼 없음');
          return;
        }

        await Promise.all(closeButtons.map(btn => btn.click({ timeout: 10000 })));

        console.log('[checkCommonModals] 모달창 닫기 성공');
        await this.waitTime(0.3);
      }
    } catch (error) {
      console.error('[checkCommonModals] 모달창 닫기 실패:', error);
      await this.waitTime(0.5);
    }
  }

  /**
   * 팝업(모달, 인터스티셜) 열려있는지 확인
   */
  private async isModalOpen(): Promise<boolean> {
    const locators = this.modalCloseLocators.map(selector => this.getLocator(selector).first());

    await Promise.allSettled(
      locators.map(locator => locator.waitFor({ state: 'visible', timeout: 10000 }))
    );

    for (const locator of locators) {
      if (await locator.isVisible()) {
        console.log(`[isModalOpen]: true`);
        return true;
      }
    }

    console.log(`[isModalOpen]: false`);
    return false;
  }

  /**
   * expect 함수 실패 시 로그 출력
   */
  private logCallerError(error: unknown, message: string) {
    const stack = new Error().stack;
    const callerName =
      stack?.split('\n')[3]?.trim().match(/at (.+?) /)?.[1] || 'Unknown';
    console.warn(`[${callerName}] ${message}`, error);
  }

  /**
   * 홈페이지(메인페이지)로 이동
   */
  public async gotoHomePage() {
    const home = urlLocator.main[this.platform];
    await this.ensurePage().goto(home);

    try {
      const regex = new RegExp(`.*${home}`);
      await this.ensurePage().waitForURL(regex, { timeout: 10000 });
      await expect(this.ensurePage().url()).toContain(home);
      await this.waitPage();
      await this.checkCommonModals();
    } catch (error) {
      this.logCallerError(error, 'gotoHomePage 실패');
      return false;
    }
  }

  /**
   * 명시적 대기(강제 대기) 함수
   */
  public async waitTime(time: number) {
    await this.ensurePage().waitForTimeout(time * 1000);
  }

  /**
   * 랜덤 정수 만드는 함수 / min, max 포함
   */
  public getRandomInt(min: number, max: number) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`random_number: ${randomNum}`);
    return randomNum;
  }

  /**
   * url 이동 시 대기 및 url 값 포함 여부 확인
   */
  public async checkURL(url: string) {
    try {
      const regex = new RegExp(`.*${url}`);
      console.log(`현재 페이지 URL : ${this.ensurePage().url()}\n포함 URL : ${url}`);
      await this.ensurePage().waitForURL(regex, { timeout: 10000 });
      await expect(this.ensurePage().url()).toContain(url);
    } catch (error) {
      this.logCallerError(error, 'URL 변경 감지 실패');
      return false;
    }
  }

  /**
   * PC, MW GNB 메뉴 진입
   *
   * [0]:platform, [1]:url 값 전달
   *
   * PC ↓
   *
   * 가장 상위 메뉴 진입 시 args 인자 1개 전달 후 클릭
   *
   * 하위 메뉴 진입 시 상위 메뉴 호버 동작 후 하위 메뉴 클릭
   *
   * args 여러 인자 전달 시, 인자는 상위 메뉴부터 전달
   *
   * MW ↓
   *
   * GNB 좌측 메뉴 선택(args[0]) > 전체펼침 > 진입 메뉴(args[1])
   */
  public async moveGNB(platform: Platform, urlText: string, ...args: string[]) {
    const page = this.ensurePage();
    const retriesCount = 5;
    const currentUrl = await page.url();
    let retries = 0;

    console.log(`[moveGNB] currentUrl: ${currentUrl}`);
    console.log(`[moveGNB] : ${urlText} 이동 시도`);

    const performNavigation = async () => {
      await this.checkCommonModals();
      await this.waitTime(0.5);
      console.log(`[moveGNB] 이동 전 URL: ${await page.url()}`);

      if (platform !== 'PC_WEB') {
        if (!(await page.url().includes('gnb'))) {
          await this.click(uiLocator.hamburger[this.uiType], false);
        }
      }

      if (args.length > 1) {
        if (platform === 'PC_WEB') {
          await this.getLocator(args[0]).hover({ timeout: 10000 });
        } else {
          await this.click(args[0], false);
          await this.click(uiLocator.expandAllButton[this.uiType], false);
        }
        await this.click(args[1], false);
      } else {
        await this.click(args[0], false);
      }

      await this.waitTime(1);
      await page.waitForURL(url => url.toString() !== currentUrl, { timeout: 10000 });

      const newUrl = await page.url();
      console.log(`[moveGNB] 이동 후 URL: ${newUrl}`);

      if (!newUrl.includes(urlText)) {
        throw new Error(`[moveGNB] 이동 실패: 예상한 URL(${urlText})을 포함하지 않음`);
      }
    }

    try {
      while (retries < retriesCount) {
        try {
          if (await page.url().includes(urlText)) return;
          await performNavigation();
          await this.waitPage();
          return;
        } catch (error) {
          console.warn(`[moveGNB] ${retries + 1}회 실패\nERROR: ${error}`);
          retries++;
        }
      }

      throw new Error(`[moveGNB] 이동 실패: ${retries}회 시도 실패`);
    } catch (error) {
      throw new Error(`[moveGNB] 최종 실패\nERROR: ${error}`);
    }
  }


  /**
   * 페이지 로드 대기
   *
   * DOM 구성, 이미지, 외부 CSS 등 모든 리소스 끝까지 다운로드 완료
   */
  public async waitPage() {
    await this.ensurePage().waitForLoadState('load');
  }

  /**
   * URL로 페이지 이동
   */
  public async gotoURL(url: string) {
    await this.ensurePage().goto(url);

    try {
      await this.ensurePage().waitForURL(url, { timeout: 10000 });
      await expect(this.ensurePage()).toHaveURL(url);
      await this.waitPage();
      await this.checkCommonModals();
    } catch (error) {
      this.logCallerError(error, 'gotoURL 실패');
      return false;
    }
  }

  /**
   * selector 대기
   */
  public async waitSelector(locator: string, timeout: number = 10000): Promise<void> {
    try {
      await this.ensurePage().waitForSelector(locator, { timeout: timeout });
      console.log(`[waitSelector] 로딩 완료 : ${locator}`);
    } catch (error) {
      console.error(`[waitSelector] 로딩 실패 : ${locator}`, error);
      throw error;
    }
  }

  /**
   * 로딩 스피너 없어질 때 까지 대기
   */
  public async waitLoading(): Promise<void> {
    try {
      // 요소가 사라질 때까지 기다림
      await this.ensurePage().waitForSelector('.c-loading-wrap', {
        state: 'detached',
        timeout: 10000,
      });
      console.log('로딩 완료');
    } catch (error) {
      console.error('로딩 완료되지 않음', error);
      throw error;
    }
  }

  /**
   * title 확인 / 해당 요소 innerText 값 비교
   */
  public async checkTitle(target: string | Locator, titleText: string) {
    const locator = typeof target === 'string' ? await this.getLocator(target) : target;

    try {
      if (typeof target === 'string') {
        await this.waitSelector(target);
      } else {
        await locator.waitFor({ timeout: 10000 });
      }

      await locator.scrollIntoViewIfNeeded();
      await expect(locator).toContainText(titleText);
    } catch (error) {
      this.logCallerError(error, 'checkTitle 실패');
      return false;
    }
  }

  /**
   * img 확인
   *
   * 해당 요소 개수(0개 보다 많은지) 확인
   *
   * visible 상태인지 확인
   */
  public async checkImg(target: string | Locator) {
    const locator = typeof target === 'string' ? await this.getLocator(target) : target;

    try {
      if (typeof target === 'string') {
        await this.ensurePage().waitForSelector(target, { state: 'attached', timeout: 10000 });
      } else {
        await locator.waitFor({ timeout: 10000 });
      }

      const count = await locator.count();
      await expect(count).toBeGreaterThan(0);

      await locator.nth(0).scrollIntoViewIfNeeded();

      for (let i = 0; i < count; i++) {
        const image = locator.nth(i);
        await expect(image).toBeVisible();
      }
    } catch (error) {
      this.logCallerError(error, 'checkImg 실패');
      return false;
    }
  }

  /**
   * text 또는 textlist 포함 여부 확인
   */
  public async checkText(target: string | Locator, textList: string | string[]) {
    const locator = typeof target === 'string' ? await this.getLocator(target) : target;

    try {
      if (typeof target === 'string') {
        await this.waitSelector(target);
      } else {
        await locator.waitFor({ timeout: 10000 });
      }

      const sectionText = await locator.innerText();
      const text = sectionText.replace(/\s+/g, '').trim();

      if (typeof textList === 'string') {
        const cleaned = textList.replace(/\s+/g, '').trim();
        console.log(`[checkText] text: ${text}, textList: ${cleaned}`);
        await expect(text).toContain(cleaned);
      } else {
        const cleanedList = textList.map(item => item.replace(/\s+/g, '').trim());
        console.log(`[checkText] text: ${text}, textList: ${cleanedList}`);
        for (const cleanedItem of cleanedList) {
            await expect(text).toContain(cleanedItem);
        }
      }
    } catch (error) {
      this.logCallerError(error, 'checkText 실패');
      return false;
    }
  }

  /**
   * 해당 요소의 text가 0보다 큰 숫자인지 확인
   */
  public async checkPositiveNumber(target: string | Locator) {
    const locator = typeof target === 'string' ? await this.getLocator(target) : target;

    try {
      if (typeof target === 'string') {
        await this.waitSelector(target);
      } else {
        await locator.waitFor({ timeout: 10000 });
      }

      await expect.poll(
        async () => {
          const checkText = await locator.innerText();
          const reText = checkText.replace(/[^0-9]/g, '');
          console.log(`숫자 텍스트: ${reText}`);
          return Number(reText);
        },
        {
          message: '0보다 큰 숫자가 될 때까지 기다리기 실패.',
        }
      ).toBeGreaterThan(0);
    } catch (error) {
      this.logCallerError(error, 'checkPositiveNumber 실패');
      return false;
    }
  }

  /**
   * 해당 요소의 text가 0 이상의 숫자인지 확인
   */
  public async checkNumber(target: string | Locator) {
    const locator = typeof target === 'string' ? await this.getLocator(target) : target;

    try {
      if (typeof target === 'string') {
        await this.waitSelector(target);
      } else {
        await locator.waitFor({ timeout: 10000 });
      }

      await expect.poll(
        async () => {
          const checkText = await locator.innerText();
          const reText = checkText.replace(/[^0-9]/g, '');
          console.log(`숫자 텍스트: ${reText}`);
          return Number(reText);
        },
        {
          message: '0 이상의 숫자가 될 때까지 기다리기 실패.',
        }
      ).toBeGreaterThanOrEqual(0);
    } catch (error) {
      this.logCallerError(error, 'checkNumber 실패');
      return false;
    }
  }


  /**
   * 요소 존재 여부 확인
   */
  public async checkEl(locator: string) {
    try {
      await this.ensurePage().waitForSelector(locator, { state: 'attached', timeout: 10000 });
      const el = await this.getLocator(locator);
      const count = await el.count();
      await expect(count).toBeGreaterThan(0);
    } catch (error) {
      this.logCallerError(error, 'checkEl 실패');
      return false;
    }
  }

  /**
   * 요소 visible 여부 확인
   */
  public async checkVisible(target: string | Locator) {
    const locator = typeof target === 'string' ? await this.getLocator(target) : target;

    if (typeof target === 'string') {
      await this.waitSelector(target);
    } else {
      await locator.waitFor({ timeout: 10000 });
    }

    await expect(locator).toBeVisible();
  }

  /**
   * 브라우저 페이지(탭) 전환
   *
   * 클릭할 요소 인자로 전달
   */
  public async switchContext(target: string | Locator) {
    const locator = typeof target === 'string' ? await this.getLocator(target) : target;

    try {
      const context = this.ensurePage().context();
      // 새 탭이 열릴 때까지 최대 10초 대기
      const [newPage] = await Promise.all([
        context.waitForEvent('page', { timeout: 10000 }),
        await this.click(locator.last()),
      ]);

      await newPage.bringToFront();
      this.page = newPage;
      await this.waitTime(2);
      console.log('[switchContext] 새 탭으로 전환 완료');
    } catch (error) {
      console.warn('[switchContext] 새 탭 전환 실패:', error);
      return false;
    }
  }

  /**
   * 최초 페이지로 전환 및 나머지 탭 전부 닫기
   */
  public async returnContext() {
    try {
      const allPages = await this.ensurePage().context().pages();
      console.log(`전체 페이지 : ${allPages.length}개`);
      const originalPage = allPages[0];

      await originalPage.bringToFront();
      this.page = originalPage;
      const ogPageURL = await originalPage.url();
      console.log(`현재 페이지 : ${ogPageURL}`);

      for (const page of allPages) {
        if (page.url() !== ogPageURL) {
          await page.close();
        }
      }
    } catch (error) {
      console.warn('[returnContext] page 전환 실패:', error);
      return false;
    }
  }

  /**
   * 페이지(url) 변경될 때 까지 클릭
   */
  public async clickMovePage(target: string | Locator) {
    const locator = typeof target === 'string' ? await this.getLocator(target) : target;

    if (typeof target === 'string') {
      await this.waitSelector(target);
    } else {
      await locator.waitFor({ timeout: 10000 });
    }

    const page = this.ensurePage();
    const currentUrl = await page.url();
    console.log(`[clickMovePage] currentUrl: ${currentUrl}`);

    try {
      for (let i = 0; i < 5; i++) {
        await this.click(locator);
        await this.waitPage();
        console.log(`[clickMovePage] 클릭 후 페이지: ${await page.url()}`);

        if (currentUrl !== await page.url()) {
          break;
        }
      }
    } catch (error) {
      console.warn(`[clickMovePage] 클릭 후 이동 실패\nERROR: ${error}`);
      return false;
    }
  }

  /**
   * step 에서 사용하는 함수
   *
   * 테스트 케이스 시작 함수
   *
   * GNB 이동하지 않고 메인페이지에서 시작하는 TC에서 사용
   */
  async startInMainPage(): Promise<boolean> {
    try {
      await this.gotoHomePage();
      return true;
    } catch (err) {
      console.error('[startInMainPage Failed]', err);
      return false;
    }
  }

  /**
   * step 에서 사용하는 함수
   *
   * 테스트 케이스 시작 함수
   *
   * GNB로 페이지 이동하는 TC에서 사용
   */
  async testStartAndMovePage(platform: Platform, url: string, ...args: string[]): Promise<boolean> {
    try {
      await this.gotoHomePage();
      await this.moveGNB(platform, url, ...args);
      await this.checkCommonModals();
      return true;
    } catch (err) {
      console.error('[testStartAndMovePage Failed]', err);
      return false;
    }
  }

  /**
   * step 함수명 추출하는 함수
   *
   * runTestSteps()에서 사용
   */
  public getCallerFunctionName(depth = 3): string {
    const stack = new Error().stack;
    if (!stack) return 'unknown';
    const lines = stack.split('\n');
    const targetLine = lines[depth] || '';
    const match = targetLine.trim().match(/at (.+?) /);
    const fullName = match?.[1] ?? 'unknown';
    const parts = fullName.split('.');
    return parts[parts.length - 1];
  }

  /**
   * step 포매터
   */
  async runTestSteps(
    steps: Array<() => Promise<boolean>>,
  ): Promise<boolean> {
    const resolvedLabel = this.getCallerFunctionName();
    this.logger.info(`[${resolvedLabel}] 테스트 시작`);

    const testResults: boolean[] = [];

    for (const step of steps) {
      try {
        const result = await step();
        testResults.push(result);
      } catch (err) {
        console.warn(`[runTestSteps] 에러 발생:`, err);
        testResults.push(false);
      }
    }

    const result = testResults.every(r => r === true);

    if (result) {
      this.logger.info(`[${resolvedLabel}] PASS / testResults: ${testResults}`);
      return true;
    } else {
      this.logger.info(`[${resolvedLabel}] FAIL / testResults: ${testResults}`);
      return false;
    }
  }
}
