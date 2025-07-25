/**
 * Description : MobileActions.ts - 📌 Appium 만 사용한 모바일 전용 액션 유틸리티 클래스
 * - Appium을 기반으로 다양한 모바일 테스트 액션을 제공하며, 플랫폼(Android/iOS)에 따라 서로 다른 로직을 처리
 */
import { ActionConstants } from '@common/constants/ActionConstants.js';
import { BasePocFixture } from '@common/fixtures/BasePocFixture';
import { uiLocator } from '@common/locators/uiLocator.js';
import { Logger } from '@common/logger/customLogger';
import type { Platform } from '@common/types/platform-types.ts';
import { ContextUtils } from '@common/utils/context/contextUtils.js';
import { POCEnv } from '@common/utils/env/POCEnv';
import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { execSync } from 'child_process';
import type { ChainablePromiseElement, Element } from 'webdriverio';
import type { Browser } from 'webdriverio';
import type winston from 'winston';

import { urlLocator } from '../locators/urlLocator';

type WDElement = Awaited<ReturnType<Browser['$']>>; // ChainablePromiseElement<Element>

const DEFAULT_RETRY = 5;

export class AppActions {
  protected driver: Browser;
  protected platform: Platform;
  private readonly poc: string = POCEnv.getType();

  constructor(driver: Browser) {
    this.driver = driver;

    const platformName = driver.capabilities?.platformName?.toString().toLowerCase();
    if (platformName?.includes('android')) this.platform = 'ANDROID_APP';
    else if (platformName?.includes('ios')) this.platform = 'IOS_APP';
    else throw new Error(`Unsupported platform: ${platformName}`);
  }

  /**
   * 현재 플랫폼이 Android인지 확인
   */
  public isAndroid(): boolean {
    return this.platform === 'ANDROID_APP';
  }

  /**
   * 현재 플랫폼이 iOS인지 확인
   */
  public isIOS(): boolean {
    return this.platform === 'IOS_APP';
  }

  /**
   * 현재 플랫폼 확인
   */
  public getMobileOsType(): 'android' | 'ios' {
    return this.platform === 'ANDROID_APP' ? 'android' : 'ios';
  }

  // ========== Appium 전용 ==========
  //커스텀

  //로딩까지 기다리기
  protected async waitForPageLoad(timeout = 10_000): Promise<void> {
    await this.driver.pause(1000);
    // 1. readyState가 complete인지 확인
    await this.driver.waitUntil(
      async () => {
        const state = await this.driver.execute(() => document.readyState);
        return state === 'complete';
      },
      {
        timeout,
        timeoutMsg: '페이지 로딩 완료 실패',
      },
    );
    // 2. 추가 pause로 렌더링 안정화 시간 확보
    await this.driver.pause(1000);
  }

  protected async waitForPageLoad2(timeout = 30_000): Promise<void> {
    await this.driver.waitUntil(
      async () => {
        // 1) <string> 제거
        // 2) 반환값을 string으로 단언
        const readyState = (await this.driver.executeScript(
          'return document.readyState;',
          [],
        )) as string;
        return readyState === 'complete';
      },
      { timeout, interval: 500, timeoutMsg: `페이지 로딩 대기 중 타임아웃 (${timeout}ms)` },
    );
  }

  //요소 보일때까지 기다리기
  public async waitForElement(
    selector: string,
    timeout: number = 5000,
  ): Promise<ChainablePromiseElement> {
    // 1) selector로 element 핸들링 (ChainablePromiseElement<WDIOElement> 반환)
    const el: ChainablePromiseElement = await this.driver.$(selector);

    // 2) DOM에 attach될 때까지 대기
    await el.waitForExist({ timeout });

    // 3) 화면에 보여질 때까지 대기
    await el.waitForDisplayed({ timeout });

    // 4) element 반환
    return el;
  }

  //이미지 checkImg
  public async checkImg(selector: string): Promise<boolean> {
    const imgEl = await this.driver.$(selector);
    if (!(await imgEl.isExisting())) return false;

    const loaded = await this.driver.execute(
      // img를 any로 받으면 TS 에러 사라집니다
      (img: any) => img.complete && img.naturalWidth > 0,
      imgEl,
    );
    return Boolean(loaded);
  }

  //네이티브전환
  public async nativeChange(): Promise<void> {
    try {
      await ContextUtils.switchToNativeContext(this.driver);
    } catch (e) {
      console.warn('[AuthPage] Native 컨텍스트 전환 실패', e);
    }
  }

  //웹전환
  public async webChange0(): Promise<void> {
    try {
      await ContextUtils.forceSwitchToWebviewContext(this.driver);
    } catch (e) {
      console.error('[AuthPage] WebView 컨텍스트 전환 실패', e);
      throw e;
    }
  }
  //웹전환로직추가
  public async webChange(): Promise<void> {
    try {
      await this.driver.switchContext('WEBVIEW_com.lguplus.mobile.cs');
      console.log('switched to WEBVIEW_com.lguplus.mobile.cs');
    } catch (e) {
      console.error('WebView 컨텍스트 전환 실패', e);
      throw e;
    }
  }

  //양쪽전환
  public async changePage(): Promise<void> {
    try {
      await ContextUtils.switchToNativeContext(this.driver);
    } catch (e) {
      console.warn('[AuthPage] Native 컨텍스트 전환 실패', e);
    }
    try {
      await ContextUtils.forceSwitchToWebviewContext(this.driver);
    } catch (e) {
      console.error('[AuthPage] WebView 컨텍스트 전환 실패', e);
      throw e;
    }
  }

  //네이티브 인지 웹뷰 인지 확인함
  public async logElementContext(
    target: string | ChainablePromiseElement,
  ): Promise<'NATIVE_APP' | 'WEBVIEW' | 'UNKNOWN'> {
    type ContextType = 'NATIVE_APP' | 'WEBVIEW' | 'UNKNOWN';

    let el: ChainablePromiseElement | undefined;
    let desc: string;

    if (typeof target === 'string') {
      el = await this.findAppiumElement(target);
      desc = target;
    } else {
      el = target;
      desc = (el as any).selector ?? el.toString();
    }

    if (!el || !(await el.isExisting())) {
      console.log(`🔴요소를 찾을 수 없습니다: ${desc}`);
      return 'UNKNOWN';
    }

    // getContext() 가 string | DetailedContext 이므로
    const rawCtx = await this.driver.getContext();
    // string 이 아니면 toString() 또는 JSON.stringify 로 변환
    const ctxName =
      typeof rawCtx === 'string' ? rawCtx : ((rawCtx as any).name ?? JSON.stringify(rawCtx));

    console.log(`Current driver context: ${ctxName}`);

    if (ctxName === 'NATIVE_APP') {
      console.log(`🔵[${desc}] 은 네이티브 컨텍스트 요소입니다.`);
      return 'NATIVE_APP';
    }

    // 이제 ctxName 은 확실히 string 이므로 startsWith 사용 가능
    if (ctxName.startsWith('WEBVIEW')) {
      console.log(`🟢[${desc}] 은 WebView 컨텍스트 요소입니다.`);
      return 'WEBVIEW';
    }

    console.log(`🟡[${desc}] 의 컨텍스트를 알 수 없습니다.`);
    return 'UNKNOWN';
  }

  //체크텍스트
  //사용법 await this.checkText(mobileLocator.banner[this.uiType], '확인하고 싶은문구');
  public async checkText(selector: string, expectedText: string, timeout = 5000): Promise<boolean> {
    // XPath로 추정되면 프리픽스 추가
    const using =
      selector.startsWith('//') || selector.startsWith('.//') ? `xpath=${selector}` : selector;

    const el = await this.driver.$(using);
    await el.waitForDisplayed({ timeout });
    const actual = (await el.getText()).trim();
    return actual === expectedText;
  }

  public async checkTexts(selector: string, ...expectedTexts: string[]): Promise<boolean> {
    const timeout = 2000;
    const el = await this.driver.$(selector);
    await el.waitForDisplayed({ timeout });

    const actual = (await el.getText()).trim();
    const missing = expectedTexts.filter(exp => !actual.includes(exp));

    if (missing.length > 0) {
      console.warn(
        `[checkTexts] actual에 없는 값:\n` +
          ` actual: "${actual}"\n` +
          ` missing: [${missing.join(', ')}]`,
      );
      return false;
    } else {
      console.log(`[checkTexts] 모두 포함: "${actual}"`);
      return true;
    }
  }

  //ensuredriver
  protected ensureDriver(): Browser {
    if (!this.driver) {
      throw new Error('Appium Driver가 설정되지 않았습니다.');
    }
    return this.driver;
  }

  public async checkVisible(
    target: string | WDElement | ChainablePromiseElement | undefined,
  ): Promise<void> {
    if (!target) {
      throw new Error('checkVisibleApp에 전달된 target이 없습니다.');
    }

    let el: ChainablePromiseElement;

    if (typeof target === 'string') {
      el = await this.findAppiumElement(target); // 내부 함수 직접 사용
    } else if (typeof (target as WDElement).waitForExist === 'function') {
      el = target as ChainablePromiseElement;
    } else {
      throw new Error('지원되지 않는 target 타입입니다.');
    }

    await el.waitForExist({ timeout: 5000 });
    await el.waitForDisplayed({ timeout: 5000 });
  }
  /**
   * Appium: 텍스트 입력
   */
  public async type(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.setValue(text);
  }

  /**
   * Appium: 요소 찾기
   */
  public async findAppiumElement(selector: string): Promise<ChainablePromiseElement> {
    try {
      const el = await this.driver?.$(selector); // <- 여기 `await` 필요
      if (!el) throw new Error(`[findAppiumElement] 요소를 찾을 수 없습니다: ${selector}`);
      return el;
    } catch (e) {
      throw new Error(`[findAppiumElement] 요소 탐색 중 오류 발생: ${selector}\n${e}`);
    }
  }

  public async redefineElement(original: any) {
    try {
      if (!original) return undefined;
      const tag = await original.getTagName();
      const id = await original.getAttribute('id');
      const candidates: string[] = [];
      if (id) candidates.push(`${tag}#${id}`);
      for (const selector of candidates) {
        const found = await this.driver?.$$(selector);
        if (Array.isArray(found) && found.length === 1) return found[0];
      }
      return await this.driver?.execute('return arguments[0];', original);
    } catch {
      return undefined;
    }
  }

  /**
   * Appium: 탭
   */
  public async tap(x: number, y: number): Promise<void> {
    await this.driver?.touchAction({ action: 'tap', x, y });
  }

  /**
   * Appium: swipe up 동작
   */
  public async swipeUp(): Promise<void> {
    const x = 300;
    const startY = this.isAndroid() ? 800 : 600;
    const endY = this.isAndroid() ? 300 : 200;

    await this.driver?.touchAction([
      { action: 'press', x, y: startY },
      { action: 'wait', ms: 200 },
      { action: 'moveTo', x, y: endY },
      'release',
    ]);
  }

  /**
   * Appium: swipe down 동작
   */
  public async swipeDown(): Promise<void> {
    const x = 300;
    const startY = this.isAndroid() ? 300 : 200;
    const endY = this.isAndroid() ? 800 : 600;

    await this.driver?.touchAction([
      { action: 'press', x, y: startY },
      { action: 'wait', ms: 200 },
      { action: 'moveTo', x, y: endY },
      'release',
    ]);
  }

  /**
   * Appium: Y 오프셋만큼 스크롤
   * - 중앙 X좌표 기준으로 터치 후 Y 방향으로 이동
   * - 기본 좌표값은 ActionConstants에서 가져옴
   */
  public async scrollByOffset(yOffset: number): Promise<void> {
    const windowSize = await this.driver?.getWindowSize();
    const x = windowSize ? windowSize.width / 2 : ActionConstants.touchTapX;

    // 플랫폼에 따라 startY 계산
    let startY: number;
    switch (this.platform) {
      case 'ANDROID_APP':
        startY = windowSize ? windowSize.height / 2 : ActionConstants.touchStartY.android;
        break;
      case 'IOS_APP':
        startY = windowSize ? windowSize.height / 2 : ActionConstants.touchStartY.ios;
        break;
      default:
        throw new Error(`Unsupported platform for scrollByOffset: ${this.platform}`);
    }

    const endY = startY - yOffset;

    await this.driver?.touchAction([
      { action: 'press', x, y: startY },
      { action: 'wait', ms: ActionConstants.swipeWaitMs },
      { action: 'moveTo', x, y: endY },
      'release',
    ]);
  }

  /**
   * Appium: 주어진 컨텍스트 이름을 기준으로 여러 번 재시도 후 컨텍스트 전환
   */
  public async switchToContextSafe(contextName: string, retry = DEFAULT_RETRY): Promise<void> {
    for (let i = 0; i < retry; i++) {
      const contexts = await this.driver?.getContexts();
      const found = contexts?.find(ctx => ctx === contextName);
      if (found) {
        await this.driver?.switchContext(found);
        return;
      }
      await this.driver?.pause(1000);
    }
    throw new Error(`Context '${contextName}' not found after ${retry} retries.`);
  }

  /**
   * Appium: 기본 WebView 컨텍스트 반환
   */
  public async getDefaultWebView(): Promise<string | null> {
    const contexts = (await this.driver?.getContexts()) as string[];
    return contexts?.find(ctx => ctx.includes('WEBVIEW')) ?? null;
  }

  /**
   * Appium: WebView Context로 전환
   */
  public async switchToWebviewContext(): Promise<void> {
    const webview = await this.getDefaultWebView();
    if (webview) await this.switchToContextSafe(webview);
  }

  /**
   * Appium: Native Context로 전환
   */
  public async switchToNativeContext(): Promise<void> {
    await this.switchToContextSafe('NATIVE_APP');
  }

  /**
   * Appium: 키보드 숨기기
   */
  public async hideKeyboard(): Promise<void> {
    try {
      await this.driver?.hideKeyboard();
    } catch (_) {}
  }

  /**
   * Appium: 토스트 존재 여부
   */
  public async isToastVisible(text: string): Promise<boolean> {
    if (this.isAndroid()) {
      const el = await this.driver?.$(`//android.widget.Toast[@text='${text}']`);
      return (await el?.isDisplayed()) ?? false;
    } else {
      const el = await this.findAppiumElement(`//*[@name='${text}']`);
      return (await el?.isDisplayed()) ?? false;
    }
  }

  /**
   *  Appium: 요소 클릭
   */
  public async click(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    if (!element) {
      throw new Error(`[click] 요소를 찾을 수 없습니다: ${selector}`);
    }
    await element.click();
  }

  /**
   * Appium: 더블 클릭
   */
  public async doubleClick(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.click();
    await this.driver?.pause(100);
    await element?.click();
  }

  /**
   *  Appium: 요소 더블 클릭 (딜레이 후 두 번 클릭)
   */
  public async doubleClickAppium(selector: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.click();
    await this.driver?.pause(100);
    await element?.click();
  }

  /**
   * Appium: 요소 클릭 후 페이지 변경 대기
   */
  public async clickUntilPageChange(element: WebdriverIO.Element): Promise<void> {
    const oldUrl = await this.driver.getUrl();
    await element.click();
    await this.driver.pause(1000);
    const newUrl = await this.driver.getUrl();

    if (newUrl !== oldUrl) return;
    throw new Error('Page did not change after clicking element.');
  }

  /**
   *  Appium: 텍스트 입력
   */
  public async typeAppium(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.setValue(text);
  }

  /**
   * Appium: 기존 텍스트 지우고 새 텍스트 입력
   */
  public async clearAndTypeAppium(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.clearValue();
    await element?.setValue(text);
  }

  /**
   * Appium: 텍스트 가져오기
   */
  public async getTextAppium(selector: string): Promise<string | undefined> {
    const element = await this.findAppiumElement(selector);
    return await element?.getText();
  }

  /**
   * Appium: 입력값 가져오기
   */
  public async getValueAppium(selector: string): Promise<string | undefined> {
    const element = await this.findAppiumElement(selector);
    return await element?.getValue();
  }

  /**
   * Appium: 요소 활성화 여부
   */
  public async isEnabledAppium(selector: string): Promise<boolean> {
    const element = await this.findAppiumElement(selector);
    return (await element?.isEnabled()) ?? false;
  }

  /**
   * Appium: 요소 표시 여부
   */
  public async isDisplayedAppium(selector: string): Promise<boolean> {
    const element = await this.findAppiumElement(selector);
    return (await element?.isDisplayed()) ?? false;
  }

  /**
   * Appium: 텍스트 초기화 후 입력
   */
  public async clearAndType(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.clearValue();
    await element?.setValue(text);
  }

  /**
   * Appium: 텍스트 가져오기
   */
  public async getText(selector: string): Promise<string | undefined> {
    const element = await this.findAppiumElement(selector);
    return await element?.getText();
  }

  /**
   * Appium: 활성화 여부
   */
  public async isEnabled(selector: string): Promise<boolean> {
    const element = await this.findAppiumElement(selector);
    return (await element?.isEnabled()) ?? false;
  }

  /**
   * Appium: 표시 여부
   */
  public async isDisplayed(selector: string): Promise<boolean> {
    const element = await this.findAppiumElement(selector);
    return (await element?.isDisplayed()) ?? false;
  }

  /**
   * Appium: 상태바 높이 가져오기
   */
  public async getStatusBarHeight(): Promise<number | undefined> {
    try {
      if (this.isIOS()) {
        await this.switchToNativeContext();
        const statusBar = await this.driver?.$('**/XCUIElementTypeStatusBar');
        const heightAttr = await statusBar?.getAttribute('height');
        const height = parseInt(heightAttr ?? '0');
        await this.switchToWebviewContext();
        return height;
      } else if (this.isAndroid()) {
        const windowSize = await this.driver?.getWindowSize();
        const screenHeight = await this.driver?.execute(() => screen.height);
        if (windowSize && screenHeight) {
          const height = Math.abs(screenHeight - windowSize.height);
          return height > 0 ? height : undefined;
        }
      }
    } catch (e) {
      console.warn('getStatusBarHeight() error:', e);
    }
    return undefined;
  }

  /**
   * Appium: 요소가 사라질 때 클릭 시도
   */
  public async clickUntilVisible(
    selector: string,
    retryCount = ActionConstants.maxScrollAttempts,
  ): Promise<void> {
    for (let i = 0; i < retryCount; i++) {
      const el = await this.findAppiumElement(selector);
      if (el && (await el.isDisplayed())) {
        await el.click();
        return;
      }
      await this.swipeUp();
    }
    throw new Error(`Element not visible after ${retryCount} tries: ${selector}`);
  }

  // 아마 필요 없을 듯...
  public async clickUntilInvisible(selector: string): Promise<void> {
    const el = await this.findAppiumElement(selector);
    if (!el || !(await el.isDisplayed())) return;

    await el.click();
    await this.driver?.pause(1000);

    const isVisible = await el.isDisplayed().catch(() => false);
    if (isVisible) {
      console.warn(`Element still visible after click: ${selector}`);
    }
  }

  /**
   * Appium: 스크롤 후 요소 찾기
   */
  public async scrollAndFind(selector: string, maxScroll = 5) {
    for (let i = 0; i < maxScroll; i++) {
      const el = await this.findAppiumElement(selector);
      if (el && (await el.isDisplayed())) return el;
      await this.swipeUp();
    }
    return undefined;
  }

  /**
   * Appium: 요소 위치로 스크롤 이동
   */
  public async scrollToVisibleElement(selector: string): Promise<void> {
    try {
      for (let i = 0; i < 5; i++) {
        const el = await this.findAppiumElement(selector);
        if (el && (await el.isDisplayed())) return;
        await this.driver?.execute('mobile: swipe', { direction: 'down' });
      }
    } catch (e) {
      console.warn('scrollToVisibleElement() error:', e);
    }
  }

  /**
   * Appium: 요소까지 슬라이드
   */
  public async slideToElement(el: WebdriverIO.Element): Promise<void> {
    // 1. Element가 보일 때까지 대기 (옵션)
    if (typeof el.waitForDisplayed === 'function') {
      await el.waitForDisplayed({ timeout: 3000 });
    }

    // 2. Element 좌표
    const { x, y } = await el.getLocation();

    // 3. 화면 가로 크기 구하기 (Native context용)
    // WebView면 driver.execute(() => window.innerWidth)도 가능
    let width: number;
    if (this.platform === 'ANDROID_APP' || this.platform === 'IOS_APP') {
      // Native 앱일 때는 getWindowRect/getWindowSize
      const rect = await this.driver.getWindowRect();
      width = rect.width;
    } else {
      // WebView 등 HTML context
      width = await this.driver.execute(() => window.innerWidth);
    }

    // 4. 스와이프 좌표 (정수)
    const startX = Math.round(x + width * 0.1);
    const endX = Math.round(x - width * 0.15);
    const swipeY = Math.round(y);

    // 5. Android/iOS 공통 performActions 사용
    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: swipeY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 500, x: endX, y: swipeY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await this.driver.releaseActions();
  }

  /**
   *  Appium: 권한 허용 팝업 처리
   */
  public async handlePermissions(commonEl: Record<string, string>): Promise<void> {
    const { driver } = this;
    const clickSequence = [
      '다음버튼',
      '앱_사용중에만_허용',
      '허용_버튼',
      '허용_버튼',
      '허용_버튼',
      '모두허용_버튼',
      '동의_버튼',
      '로그인하지_않고_입장할게요',
      '로그인없이_입장하기',
    ];

    for (const key of clickSequence) {
      const resourceId = commonEl[key];
      if (!resourceId) continue;
      try {
        const target = await driver?.$(`id=${resourceId}`);
        if (target && (await target.isDisplayed())) await target.click();
      } catch {}
    }
  }

  /**
   * Appium: 앱 실행 후 초기 설정 및 홈 이동 처리
   */
  public async initAppSession(commonEl: Record<string, string>, baseUrl: string): Promise<void> {
    await this.driver?.pause(1500);

    const contexts = await this.driver?.getContexts();
    if (contexts && contexts.length > 1) {
      await this.driver?.switchContext(contexts[1]);
    }
    await this.handlePermissions(commonEl);
    await this.navigateToUrl('/', baseUrl);
  }

  /**
   *  Appium: URL 이동
   */
  public async navigateToUrl(url: string, baseUrl: string): Promise<void> {
    const goto = url.startsWith('https')
      ? url
      : url.startsWith('/')
        ? `${baseUrl}${url}`
        : `${baseUrl}/${url}`;
    await this.driver?.url(goto);
    await this.driver?.pause(1000);
  }

  /**
   * Appium: 키 입력
   */
  public async pressKeyAppium(key: string): Promise<void> {
    await this.driver?.keys(key);
  }

  /**
   * Appium: 드롭다운 옵션 선택
   */
  public async selectAppiumOption(selector: string, text: string): Promise<void> {
    const element = await this.findAppiumElement(selector);
    await element?.selectByVisibleText(text);
  }

  /**
   * Appium: 초기 앱 실행 전 사전 준비 스크립트
   */
  public async preScript(): Promise<void> {
    try {
      const windowSize = await this.driver?.getWindowSize();
      const windowRect = await this.driver?.getWindowRect?.();
      const contexts = await this.driver?.getContexts();

      console.log('get_window_size =>', windowSize);
      console.log('get_window_rect =>', windowRect);
      console.log('contexts =>', contexts);

      await this.driver?.pause(1500);

      console.log('----------------------------------------------------');
      console.log('APP 로그인 페이지 진입');
      console.log('현재 컨텍스트 =>', await this.driver?.getContext());

      if (contexts && contexts.length > 1) {
        await this.driver?.switchContext(contexts[1]);
        console.log('전환된 컨텍스트 =>', await this.driver?.getContext());
      }
      console.log('----------------------------------------------------');

      if (typeof (this as any).gotoHome === 'function') {
        await (this as any).gotoHome();
      }
    } catch (e) {
      console.warn('preScript() error:', e);
    }
  }

  // 이것도 필요 없을 듯 나중에 정리
  public async scrollElementToCenter(selector: string): Promise<void> {
    try {
      const el = await this.findAppiumElement(selector);
      if (!el) return;
      await this.driver?.execute('arguments[0].scrollIntoViewIfNeeded()', el);
    } catch (e) {
      console.warn('scrollElementToCenter() error:', e);
    }
  }

  /**
   * Appium: 전체 페이지 스크롤 (상 → 하 → 상)
   */
  public async scrollFullPage(): Promise<void> {
    try {
      console.log('scrollFullPage()');
      await this.driver?.execute('mobile: swipe', { direction: 'up', velocity: 10000 });
      await this.driver?.execute('mobile: swipe', { direction: 'down', velocity: 10000 });
    } catch (e) {
      console.warn('scrollFullPage() error:', e);
    }
  }

  /**
   * Appium: 좌표 기반 스와이프 실행
   */
  public async swipeWithVelocity(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    startPress = 0.1,
    endPress = 0.1,
    speed = 445,
  ): Promise<void> {
    try {
      const data = {
        fromX,
        fromY,
        toX,
        toY,
        pressDuration: startPress,
        holdDuration: endPress,
        velocity: speed,
      };
      await this.driver?.execute('mobile: dragFromToWithVelocity', data);
    } catch (e) {
      console.warn('swipeWithVelocity() error:', e);
    }
  }

  /**
   * Appium: Native 요소 재정의
   */
  public async redefineElementByAttributes(original: any): Promise<any | undefined> {
    try {
      if (!original) throw new Error('Element is undefined');

      const tagName = await original.getTagName();
      const id = await original.getAttribute('id');
      const title = await original.getAttribute('title');
      const role = await original.getAttribute('role');
      const className = await original.getAttribute('class');

      const attributeSelectors = [
        { attr: 'id', value: id },
        { attr: 'title', value: title },
        { attr: 'role', value: role },
      ];

      const candidates: string[] = attributeSelectors
        .filter(({ value }) => value)
        .map(({ attr, value }) => `${tagName}[${attr}="${value}"]`);

      if (id) candidates.unshift(`${tagName}#${id}`);
      if (className) candidates.push(`${tagName}.${className.trim().replace(/\s+/g, '.')}`);

      for (const selector of candidates) {
        const found = await this.driver?.$$(selector);
        if (Array.isArray(found) && found.length === 1) return found[0];
      }

      return await this.driver?.execute('return arguments[0];', original);
    } catch (e) {
      console.warn('redefineElementByAttributes error:', e);
      return undefined;
    }
  }

  /**
   * Appium: Native 요소 로딩 Chain
   */
  public async waitForNativeElement(
    selector: string,
    strategy: 'id' | 'ios_chain',
    maxRetry: number = DEFAULT_RETRY,
  ): Promise<any | undefined> {
    const locatorPrefix = strategy === 'id' ? 'id=' : '-ios class chain:';
    const locator = `${locatorPrefix}${selector}`;

    let attempt = 0;
    while (attempt < maxRetry) {
      try {
        const el = await this.driver?.$(locator);
        if (el && (await el.isDisplayed())) return el;
      } catch (error) {
        console.error('Error while waiting for native element:', error);
      }
      await this.driver?.pause(1000);
      attempt++;
    }

    return undefined;
  }

  /**
   * Appium: Native 드래그 동작
   */
  public async dragAndDropX(el: any, offsetX: number = -200): Promise<void> {
    await this.driver?.touchAction([
      { action: 'press', element: el },
      { action: 'wait', ms: 200 },
      { action: 'moveTo', x: offsetX, y: 0 },
      'release',
    ]);
  }

  /**
   * Appium: 모달이 있으면 닫기
   */
  public async closeModalIfPresent(selector: string): Promise<void> {
    const modal = await this.findAppiumElement(selector);
    if (modal && (await modal.isDisplayed())) {
      await modal.click();
    }
  }

  /**
   * Appium: 요소 중심을 터치 (WebView 요소)
   */
  public async tapWebviewElementByCenter(selector: string): Promise<void> {
    const el = await this.findAppiumElement(selector);
    if (!el) return;

    // 위치와 크기 가져오기
    const { x, y } = await el.getLocation();
    const { width, height } = await el.getSize();

    // 중앙 좌표 계산
    const centerX = Math.round(x + width / 2);
    const centerY = Math.round(y + height / 2);

    await this.tap(centerX, centerY);
  }

  /**
   * Appium: 요소로 스크롤 이동 (native 방식)
   */
  public async scrollToAppium(selector: string): Promise<void> {
    const el = await this.findAppiumElement(selector);
    if (el) {
      await this.driver?.execute('mobile: scroll', { element: el.elementId, toVisible: true });
    }
  }

  /**
   * Appium: select 드롭다운 옵션 선택 (WebView일 수도 있음)
   */
  public async selectOption(selector: string, text: string): Promise<void> {
    const el = await this.findAppiumElement(selector);
    await el?.selectByVisibleText(text);
  }

  /**
   * Appium: 컨텍스트 전환
   */
  public async switchView(context: string = 'default', maxRetry = DEFAULT_RETRY): Promise<void> {
    let targetContext = context;
    if (context === 'default') {
      targetContext = (await this.getDefaultWebView()) ?? 'NATIVE_APP';
    }
    await this.switchToContextSafe(targetContext, maxRetry);
  }

  /**
   *  Appium: Chrome 초기화
   */
  public clearChromeData(version: string = 'stable'): void {
    const packageName = version === 'beta' ? 'com.chrome.beta' : 'com.android.chrome';
    const udid = (this.driver?.capabilities as any).udid;
    if (!udid) throw new Error('UDID not found in driver capabilities.');

    const cmd = `adb -s ${udid} shell pm clear ${packageName}`;
    try {
      const result = execSync(cmd, { encoding: 'utf-8' });
      if (!result.includes('Success')) throw new Error(`Chrome clear failed: ${result}`);
    } catch (e) {
      throw new Error(`clearChromeData failed: ${(e as Error).message}`);
    }
  }

  /**
   * Appium: 컨텍스트 전환
   */
  public async switchToContext(contextName: string): Promise<void> {
    const contexts = (await this.driver?.getContexts()) as string[];
    if (contexts?.includes(contextName)) {
      await this.driver?.switchContext(contextName);
      return;
    }
    await this.driver?.pause(500);
  }

  /**
   * Appium: Native 요소 스크롤 후 재정의
   */
  public async scrollToElementAndRedefine(
    selector: string,
  ): Promise<WebdriverIO.Element | undefined> {
    try {
      const chainableElement = this.driver?.$(selector);
      if (!chainableElement) return undefined;

      const element = (await chainableElement) as unknown as WebdriverIO.Element;

      await this.driver?.execute('arguments[0].scrollIntoView(true);', element);
      return await this.redefineElement(element);
    } catch {
      return undefined;
    }
  }

  /**
   * Appium: 임의 위치 스와이프
   */

  /**
   *  Appium: 입력값 가져오기
   */
  public async getValue(selector: string): Promise<string | undefined> {
    const element = await this.findAppiumElement(selector);
    return await element?.getValue();
  }

  /**
   * Appium: 상단으로 스크롤
   */
  public async scrollToTop(): Promise<void> {
    await this.driver?.execute('mobile: scroll', { direction: 'up' });
  }

  /**
   * Appium: 하단으로 스크롤
   */
  public async scrollDown(): Promise<void> {
    await this.driver?.execute('mobile: scroll', { direction: 'down' });
  }

  /**
   * Appium: 위/아래로 지정 횟수 스크롤
   */
  public async scrollByDirection(direction: 'up' | 'down', count = 3): Promise<void> {
    for (let i = 0; i < count; i++) {
      // mobile: swipe 대신 swipeGesture 사용
      await this.driver?.execute('mobile: swipeGesture', [
        {
          direction, // 'up' | 'down'
          percent: 0.75, // 화면 높이의 75% 만큼 스와이프
        },
      ]);
      await this.driver?.pause(500);
    }
  }

  //fin리스트찾기
  public async findList(
    parentSelector: string,
    childSelector: string,
  ): Promise<WebdriverIO.Element[]> {
    const parent = await this.driver.$(parentSelector);
    await parent.waitForDisplayed({ timeout: 5000 });

    // ChainablePromiseArray<WebdriverIO.Element>
    const chainableItems = await parent.$$(childSelector);

    // 일반 배열로 언랩핑
    const items: WebdriverIO.Element[] = [...chainableItems];
    // 또는: const items = Array.from(chainableItems);

    return items;
  }

  //fin리스트찾기 로 가져온 요소들의 텍스트만 뽑아서 리턴

  public async findListTexts(parentSelector: string, childSelector: string): Promise<string[]> {
    const items = await this.findList(parentSelector, childSelector);
    return Promise.all(items.map(async el => (await el.getText()).trim()));
  }

  //홈이동
  public async gotoHomePage() {
    await this.waitForPageLoad();
    await this.closeModalIfPresent('//button[text()="확인"]');
    console.log('모달체크완료');
    await this.click('//button[.//span[contains(text(), "전체메뉴 열기")]]');
    await this.click(
      '//button[span[contains(@class, "is-blind") and normalize-space(text())="홈 바로가기"]]',
    );
    await this.waitForPageLoad();

    await this.driver.pause(1000);
    await this.closeModalIfPresent('//button[text()="확인"]');
    console.log('홈이동완료');
  }

  //숫자확인
  public async checkNumber(target: string | WebdriverIO.Element): Promise<void> {
    let locator: WebdriverIO.Element;

    if (typeof target === 'string') {
      const locators = await this.getLocators(target); // Element[]
      locator = locators[0];

      if (!locator) {
        throw new Error(`[checkNumber] 요소를 찾을 수 없습니다: ${target}`);
      }
    } else {
      locator = target;
    }
    const checkText = await locator.getText();
    const reText = checkText.replace(/[^0-9]/g, '');

    console.log(`원본 텍스트: "${checkText}"`);
    console.log(`숫자 추출 결과: "${reText}"`);

    const price = Number(reText);

    if (!reText || isNaN(price)) {
      throw new Error(`[checkNumber] 유효한 숫자를 찾을 수 없음. 텍스트: "${checkText}"`);
    }
    console.log(`[checkNumber] 숫자 확인 성공: ${price} > 0`);
  }

  public async checkNumberTwo(
    target: string | ChainablePromiseElement,
    timeout: number = 5000,
  ): Promise<void> {
    // ─── 1) Collapse가 show 상태인지 확인 ───
    await this.driver.waitUntil(
      async () => {
        const collapseElem = await this.driver.$('.c-accordion-type6.dark_ty .collapse');
        if (!(await collapseElem.isExisting())) return false;
        const cls = await collapseElem.getAttribute('class');
        return cls !== null && cls.includes('show');
      },
      {
        timeout,
        timeoutMsg: 'Collapse가 show 상태로 전환되지 않았습니다.',
      },
    );
    // ─────────────────────────────────────────────────────

    // ─── 2) locator를 ChainablePromiseElement로 가져오기 ───
    let locator: ChainablePromiseElement;
    if (typeof target === 'string') {
      locator = this.driver.$(target);
    } else {
      locator = target;
    }

    // ─── 3) 요소 존재 대기 ───
    await locator.waitForExist({ timeout });
    // ─────────────────────────

    // ─── 4) 화면에 보일 때까지 대기 ───
    await this.driver.waitUntil(async () => await locator.isDisplayed(), {
      timeout,
      timeoutMsg: `[checkNumberTwo] 요소가 화면에 표시되지 않았습니다: ${typeof target === 'string' ? target : 'Locator'}`,
    });
    // ─────────────────────────────────────

    // ─── 5) (선택) 뷰포트 안으로 스크롤 ───
    // WebdriverIO에서는 locator.scrollIntoView()를 제공
    await locator.scrollIntoView({ block: 'center', inline: 'center' });
    // ─────────────────────────────────────

    // ─── 6A) 실제 HTML 확인(디버그용) ───
    const html = await locator.getHTML();
    console.log(`▶ [Debug] innerHTML: ${html}`);
    // innerHTML이 "<p>월 47,000원</p>"가 아니라면, 셀렉터가 p가 아닌 상위 요소를 가리키는 것

    // ─── 6B) textContent 확인(디버그용) ───
    const textContent = await locator.getAttribute('textContent');
    console.log(`▶ [Debug] textContent: "${textContent}"`);
    // WebdriverIO에서 getAttribute('textContent')는 DOM의 textContent를 그대로 반환

    // ─── 6C) getText()로 텍스트 읽어오기 ───
    // getText()는 “보이는 텍스트”를 가져오므로, 여기서 "월 47,000원"이 반환되어야 정상
    const fullText = await locator.getText();
    console.log(`원본 텍스트: "${fullText}"`);

    // ─── 7) 숫자만 남기기 ───
    const reText = fullText.replace(/[^0-9]/g, '');
    console.log(`숫자 추출 결과: "${reText}"`);

    // ─── 8) 숫자 유효성 검사 ───
    const price = Number(reText);
    if (!reText || isNaN(price)) {
      throw new Error(`[checkNumberTwo] 유효한 숫자를 찾을 수 없습니다. 텍스트: "${fullText}"`);
    }
    console.log(`[checkNumberTwo] 숫자 확인 성공: ${price} > 0`);
    // ──────────────────────────────────
  }

  public async checkInnerText(
    target: string | ChainablePromiseElement,
    timeout: number = 5000,
  ): Promise<void> {
    // 1) locator를 ChainablePromiseElement로 가져오기
    let locator: ChainablePromiseElement;
    if (typeof target === 'string') {
      locator = this.driver.$(target);
    } else {
      locator = target;
    }

    // 2) 요소가 DOM에 존재할 때까지 대기
    await locator.waitForExist({ timeout });

    // 3) 요소가 화면에 표시될 때까지 대기
    await this.driver.waitUntil(async () => await locator.isDisplayed(), {
      timeout,
      timeoutMsg: `[checkInnerText] 요소가 화면에 표시되지 않았습니다: ${
        typeof target === 'string' ? target : 'Locator'
      }`,
    });

    // 4) 뷰포트 안으로 스크롤 (필요 시)
    await locator.scrollIntoView({ block: 'center', inline: 'center' });

    // 5) innerText 읽어오기
    const innerText = await locator.getText();
    console.log(`innerText: "${innerText}"`);
  }

  /** 🛑 공통 모달 닫기(예시) */
  public async checkCommonModals(): Promise<void> {
    try {
      // 모달 요소를 탐색 (2개 중 하나라도 존재하면 진행)
      const modal = await this.driver.$('.modal-content');
      const modal2 = await this.driver.$('.ins-wrapper');

      const modalExists = await modal.isExisting();
      const modal2Exists = await modal2.isExisting();

      if (!modalExists && !modal2Exists) return;

      // 닫기 버튼 후보들
      const closeButtons = [
        await this.driver.$('.modal-footer .close'),
        await this.driver.$('.modal-header .close'),
        await this.driver.$('.ins-close-btn'),
        await this.driver.$('.ins-close-btn2'),
      ];

      await this.driver.pause(1000);

      let closeButton: ChainablePromiseElement | null = null;

      for (const btn of closeButtons) {
        if (await btn.isDisplayed()) {
          closeButton = btn;
          break;
        }
      }

      if (!closeButton || !(await closeButton.isDisplayed())) {
        console.warn('[checkCommonModals] 닫기 버튼 없음');
        return;
      }

      for (let i = 0; i < 5; i++) {
        const modalOpen = await modal.isDisplayed().catch(() => false);
        const modal2Open = await modal2.isDisplayed().catch(() => false);

        if (!modalOpen && !modal2Open) {
          return;
        }

        await closeButton.click();
        console.log('[checkCommonModals] 모달창 닫기 성공');
        await this.driver.pause(300);
      }
    } catch (error) {
      console.error('[checkCommonModals] 모달창 닫기 실패:', error);
      await this.driver.pause(500);
    }
  }
  //모달
  //await this.closeModalIfPresent(uiLocator.insButton[this.uiType]);

  ///gnb
  public async moveGNB(...args: string[]): Promise<void> {
    const retriesMax = 5;
    let retries = 0;
    const currentUrl = await this.driver.getUrl();
    console.log(`currentUrl: ${currentUrl}`);

    while (retries < retriesMax) {
      try {
        await this.checkCommonModals();
        await this.driver.pause(500);

        if (args.length === 1) {
          console.log(`[moveGNB] 이동 전 URL: ${await this.driver.getUrl()}`);
          await this.click(args[0]);
        } else if (args.length === 2) {
          const parent = this.getLocator(args[0]);
          await parent.moveTo(); // hover
          await this.driver.pause(300); // hover 애니메이션 기다림
          console.log(`[moveGNB] 이동 전 URL: ${await this.driver.getUrl()}`);
          await this.click(args[1]);
        }

        await this.driver.pause(500);

        // URL 변화를 5 초 동안 polling
        await this.driver.waitUntil(async () => (await this.driver.getUrl()) !== currentUrl, {
          timeout: 5000,
          timeoutMsg: '[moveGNB] URL 변화 없음',
        });

        console.log(`[moveGNB] 이동 후 URL: ${await this.driver.getUrl()}`);
        return;
      } catch (e) {
        console.warn(`[moveGNB] ${++retries}회 실패`, e);
      }
    }
    throw new Error(`[moveGNB] 이동 실패: ${retriesMax}회 시도`);
  }

  //count와 동일 갯수새는것
  public async countAppium(selector: string): Promise<number> {
    const elements = await this.getLocators(selector);
    return elements.length;
  }
  protected getLocator(selector: string): ChainablePromiseElement {
    return this.driver.$(selector);
  }

  public async getLocators(selector: string): Promise<WebdriverIO.Element[]> {
    const elements = (await this.driver.$$(selector)) as unknown as WebdriverIO.Element[];
    return elements;
  }
  public getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //innertext와같은역할 요소안의 텍스트를 가져옴 위를 아래처럼 수정  사용법 const phoneBtnText = await this.innerTextAppium(targetphoneBtnList);
  async innerText(element: WebdriverIO.Element | ChainablePromiseElement): Promise<string> {
    // 항상 Promise처럼 처리해서 Element로 꺼낸다
    const el: WebdriverIO.Element = (await element) as any;

    if (!el || typeof el.getText !== 'function') {
      throw new Error('innerTextAppium: 유효한 Element 인스턴스가 아닙니다.');
    }

    const txt = await el.getText();
    return txt.trim();
  }

  /**
   *  url 확인
   */
  public async checkURL(urlPart: string, timeout = 10000): Promise<boolean> {
    const start = Date.now();
    const regex = new RegExp(`.*${urlPart}`);

    while (Date.now() - start < timeout) {
      const currentUrl = await this.driver.getUrl();

      if (regex.test(currentUrl)) {
        console.log(`현재 페이지 URL : ${currentUrl}\n포함 URL : ${urlPart}`);
        expect(currentUrl).toContain(urlPart);
        return true;
      }

      await new Promise(res => setTimeout(res, 500)); // 0.5초 대기 후 재시도
    }

    // 호출한 함수명 추출 (예외 스택 기반)
    let callerName = 'UnknownFunction';
    try {
      const stack = new Error().stack;
      if (stack) {
        const match = stack
          .split('\n')[2]
          ?.trim()
          .match(/at (\w+)/);
        if (match && match[1]) {
          callerName = match[1];
        }
      }
    } catch (e) {
      // 무시
    }

    console.warn(`[${callerName}] URL 변경 감지 실패 (타임아웃)`);
    return false;
  }
  /**
   *  중앙으로 스크롤.
   */
  public async scrollToCenter(
    target: string | WebdriverIO.Element | ChainablePromiseElement,
  ): Promise<void> {
    // 1) target이 문자열이면 요소를 찾아 핸들을 가져옴
    const el = typeof target === 'string' ? await this.driver.$(target) : await target;

    // 2) JS로 중앙 스크롤 실행
    await this.driver.execute(
      'arguments[0].scrollIntoView({ block: "center", inline: "nearest" });',
      el,
    );

    console.log('[scrollToCenter] 요소를 중앙으로 스크롤했습니다.');
  }

  //클릭2 자바스크립트로 클릭
  public async forceClick(elementOrSelector: string | ChainablePromiseElement): Promise<void> {
    // 1) 실제 Element 객체를 얻는다 (waitForVisibleElement 내부에서 await 처리)
    const target = await this.waitForVisible(elementOrSelector, 2000);
    await this.driver.pause(300);
    // 2) JS 클릭 (hidden이거나 overlay로 막혀서 일반 click()이 안 될 때 우회)
    await this.driver.execute((el: HTMLElement) => el.click(), target);

    console.log('[forceClick] 강제 클릭 완료');
  }

  public async moveToClick(target: string | ChainablePromiseElement): Promise<void> {
    // 1) target이 문자열이면 WebView 컨텍스트에서 요소를 찾아서 element에 할당
    let element: ChainablePromiseElement;
    if (typeof target === 'string') {
      element = await this.driver.$(target);
    } else {
      element = target;
    }

    // 2) 요소가 DOM에 존재하고 화면에 표시될 때까지 대기
    await element.waitForExist({ timeout: 5000 });
    await this.driver.waitUntil(async () => await element.isDisplayed(), {
      timeout: 5000,
      timeoutMsg: `요소가 화면에 표시되지 않았습니다: ${typeof target === 'string' ? target : 'Locator'}`,
    });

    // 3) JavaScript로 요소의 getBoundingClientRect()를 실행하여 뷰포트 기준 좌표(중앙)를 계산하고,
    //    그 지점에 dispatchEvent('click')을 실행
    await this.driver.execute(
      (el: HTMLElement) => {
        // 3-1) 요소의 뷰포트 내 위치와 크기를 구함
        const rect = el.getBoundingClientRect();
        const centerX = Math.round(rect.left + rect.width / 2);
        const centerY = Math.round(rect.top + rect.height / 2);

        // 3-2) elementFromPoint 으로 해당 좌표상의 최상위 실제 노드를 찾음
        const clickTarget = document.elementFromPoint(centerX, centerY) as HTMLElement;
        if (!clickTarget) {
          throw new Error(`elementFromPoint에서 요소를 찾을 수 없습니다: (${centerX}, ${centerY})`);
        }

        // 3-3) 클릭 이벤트를 생성하여 dispatch
        const evt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: centerX,
          clientY: centerY,
        });
        clickTarget.dispatchEvent(evt);
      },
      element as any, // WebdriverIO Element를 그대로 전달하면 내부적으로 DOM 노드로 변환됩니다
    );

    // 4) 클릭 후 화면 변화가 있다면 잠시 대기
    await this.driver.pause(300);
  }

  //좌표이동후 클릭 클릭3
  public async forceMoveClick(selector: string | ChainablePromiseElement): Promise<void> {
    // 1) selector가 문자열이면 요소를 찾아서 element 변수에 할당
    let element: ChainablePromiseElement;
    if (typeof selector === 'string') {
      element = await this.driver.$(selector);
    } else {
      element = selector;
    }

    // 2) 요소가 DOM에 존재할 때까지 대기
    await element.waitForExist({ timeout: 5000 });
    await this.driver.waitUntil(async () => await element.isDisplayed(), {
      timeout: 5000,
      timeoutMsg: `요소가 화면에 표시되지 않았습니다: ${typeof selector === 'string' ? selector : 'Locator'}`,
    });

    // 3) 요소의 위치와 크기 구하기
    const location = await element.getLocation(); // { x, y } (뷰포트 기준)
    const size = await element.getSize(); // { width, height }

    // 4) 클릭할 정확한 좌표(중앙점) 계산
    const centerX = Math.round(location.x + size.width / 2);
    const centerY = Math.round(location.y + size.height / 2);

    console.log(`[Debug] clickByWebviewCoordinates → (${centerX}, ${centerY}) 좌표 클릭 시도`);

    // 5) WebView 컨텍스트에서 JS를 실행해, 해당 좌표 위에 있는 요소를 찾고 click 이벤트를 발생
    await this.driver.execute(
      (x: number, y: number) => {
        // document.elementFromPoint은 뷰포트 좌표(x, y)에 놓인 최상위 요소를 반환
        const elAtPoint = document.elementFromPoint(x, y) as HTMLElement | null;
        if (!elAtPoint) {
          throw new Error(`클릭 대상 요소를 찾을 수 없습니다: (${x}, ${y})`);
        }
        // 클릭 이벤트 생성 및 dispatch
        const mouseEvt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
        });
        elAtPoint.dispatchEvent(mouseEvt);
      },
      centerX,
      centerY,
    );

    // 6) (선택) 클릭 후 부수 효과나 애니메이션이 있으면 잠깐 대기
    await this.driver.pause(300);
  }

  //좌표값이용해 클릭 예시 await this.clickByBounds('[60,448][1020,568]');
  public async clickByBounds(bounds: string): Promise<void> {
    // 1) bounds 파싱
    const m = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
    if (!m) {
      throw new Error(`Invalid bounds format: ${bounds}`);
    }
    // m[1]=x1, m[2]=y1, m[3]=x2, m[4]=y2
    const x1 = parseInt(m[1], 10);
    const y1 = parseInt(m[2], 10);
    const x2 = parseInt(m[3], 10);
    const y2 = parseInt(m[4], 10);

    // 2) 중앙 좌표 계산
    const centerX = Math.floor((x1 + x2) / 2);
    const centerY = Math.floor((y1 + y2) / 2);

    // 3) 탭 액션 수행 (TouchAction 사용)
    await this.driver.touchAction({
      action: 'tap',
      x: centerX,
      y: centerY,
    });
  }

  /**
   * 특정요소가 보일때까지 대기
   * 불필요시 삭제
   */
  public async waitForVisible(
    element: string | any, // `any`로도 에러 제거 가능
    timeout: number = 3000,
  ) {
    const el = typeof element === 'string' ? await this.driver.$(element) : await element;

    await el.waitForExist({ timeout });
    await el.waitForDisplayed({ timeout });

    return el;
  }

  /**
   *  sendkeys 처럼 엔터 넣기 await this.pressEnter(mobilePlanLocator.myInfo[this.uiType]);
   * 불필요시 삭제
   */
  public async pressEnter(selector: string, timeout: number = 5000): Promise<void> {
    // 1) 요소 찾기
    const el = await this.driver.$(selector);
    if (!el) {
      throw new Error(`[pressEnter] 요소를 찾을 수 없습니다: ${selector}`);
    }

    // 2) 요소 존재(exist) 체크
    await el.waitForExist({ timeout });

    // 3) WebView 환경이라면 isDisplayed + waitUntil 로 화면에 표시될 때까지 대기
    await this.driver.waitUntil(async () => await el.isDisplayed(), {
      timeout,
      timeoutMsg: `${selector} 요소가 화면에 표시되지 않았습니다.`,
    });

    // 4) 화면에 보이도록 스크롤 (scrollIntoView)
    await this.driver.execute((e: any) => {
      (e as HTMLElement).scrollIntoView({ block: 'center', inline: 'center' });
    }, el);

    // 5) Enter 입력 (WebView 내부 input 등에서 동작)
    await el.addValue('\uE007');
  }

  //시작메시지 출력
  public async start() {
    const stack = new Error().stack;
    if (!stack) {
      console.log('[start] 함수명 추출 실패');
      return;
    }
    const fullName = stack.split('\n')[2]?.trim().split(' ')[1] || '알 수 없음';
    const functionName = fullName.split('.').pop();
    console.log(`${functionName} 테스트 시작`);
  }

  // 테스트 성공 문구 출력
  public async success() {
    await this.ensureDriver;
    const stack = new Error().stack;
    if (!stack) {
      console.log('[success] 함수명 추출 실패');
      console.log('테스트 성공');
      return;
    }
    const fullName = stack.split('\n')[2]?.trim().split(' ')[1] || '알 수 없음';
    const functionName = fullName.split('.').pop();
    console.log(`${functionName} 테스트 성공`);
  }

  /**
   * 모든 클릭시도. 추후 삭제 예정
   */
  public async clickAll(selector: string | ChainablePromiseElement): Promise<void> {
    // 1) selector가 문자열이면 요소를 찾아서 element 변수에 할당
    let element: ChainablePromiseElement;
    if (typeof selector === 'string') {
      element = await this.driver.$(selector);
    } else {
      element = selector;
    }

    try {
      console.log('클릭시도2: forceClick()');
      await this.forceClick(element);
      return; // 성공했으니 뒤의 try 블록은 실행하지 않음
    } catch {
      console.log('클릭시도실패2');
    }

    try {
      console.log('클릭시도3: forceMoveClick()');
      await this.forceMoveClick(element);
      return; // 성공했으니 뒤의 try 블록은 실행하지 않음
    } catch {
      console.log('클릭시도실패3');
    }

    try {
      console.log('클릭시도4: pressEnter()');
      // pressEnter도 문자열 셀렉터를 기대하므로 'selector as string'
      await this.pressEnter(selector as string);
      return; // 성공했으니 뒤의 try 블록은 실행하지 않음
    } catch {
      console.log('클릭시도실패4');
    }

    console.log('모든 클릭 시도 실패');
  }
  //nth
  async nth(selector: string, index: number): Promise<WDElement> {
    const i = index + 1;
    const isXPath = selector.trim().startsWith('/') || selector.trim().startsWith('(');
    const target = isXPath ? `(${selector})[${i}]` : `${selector}:nth-of-type(${i})`;
    return this.driver.$(target); // → Promise<WDElement>
  }

  /**
   * 해당요소 갯수확인 count에 해당하는함수
   */
  public async count(selector: string): Promise<number> {
    const els = await this.driver.$$(selector);
    return els.length;
  }

  public async clickAtCoordinates(x: number, y: number): Promise<void> {
    // ① 포인터를 (x,y)로 이동 → 버튼 누르기 → 버튼 떼기
    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    // ② 반드시 releaseActions 호출
    await this.driver.releaseActions();
  }
  public async wait(target: string | Awaited<ReturnType<Browser['$']>>): Promise<void> {
    // Browser['$']의 반환 타입을 함수 내부에서 정의
    type WDElement = Awaited<ReturnType<Browser['$']>>;

    // 1) 문자열이면 요소 핸들로 변환, 아니면 이미 WDElement로 간주
    const el: WDElement = typeof target === 'string' ? await this.driver.$(target) : target;

    // 2) 화면에 보일 때까지 최대 1초 대기
    await el.waitForDisplayed({
      timeout: 1000,
      timeoutMsg: `"${typeof target === 'string' ? target : 'element'}" 요소가 표시되지 않습니다.`,
    });

    // 반환값 없음
  }
  public async scroll(fraction: number): Promise<void> {
    await this.driver.executeScript('window.scrollBy(0, window.innerHeight * arguments[0]);', [
      fraction,
    ]);
  }

  /**
   * 요소를 중앙으로 로케이터 기준
   */
  async scrollCenterByLo(locator: Locator) {
    await locator.evaluate(el => {
      el.scrollIntoView({ block: 'center', inline: 'nearest' });
    });
    console.log('scrolling to center');
  }
  /**
   * 요소를 중앙으로 셀렉터기준
   */
  async scrollCenter(selector: string) {
    await this.driver.execute((sel: string) => {
      const node = document.querySelector(sel);
      if (node) {
        node.scrollIntoView({ block: 'center', inline: 'nearest' });
      }
    }, selector);
    console.log(`scrolled '${selector}' to center`);
  }

  //부드러운 스크롤 이동
  public async smoothScrollTo(selector: string): Promise<void> {
    const element = await this.driver.$(selector);
    await this.driver.pause(500);
    // 스크립트 타임아웃 늘리기 (기본값은 너무 짧음)
    await this.driver.setTimeout({ script: 10000 });

    await this.driver.executeAsync(
      (el: HTMLElement, done: () => void) => {
        const elementY = el.getBoundingClientRect().top + window.pageYOffset;
        const startY = window.scrollY;
        const distance = elementY - startY - window.innerHeight / 2 + el.clientHeight / 2;
        const duration = 600;
        const startTime = performance.now();

        const step = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeInOut =
            progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

          window.scrollTo(0, startY + distance * easeInOut);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            done();
          }
        };
        requestAnimationFrame(step);
      },
      element as unknown as HTMLElement,
    );
    await this.driver.pause(2000);
    this.driver.pause(2000);
  }
  public async closeAnyModal(selectors: string[], timeout = 3000): Promise<boolean> {
    for (const selector of selectors) {
      try {
        const el = await this.driver.$(selector);
        const exists = await el.isExisting();

        if (exists) {
          const isVisible = await el.isDisplayed();

          if (isVisible && (await el.isClickable())) {
            await el.click();
            console.log(`✅ 모달 닫기 완료: ${selector}`);
            return true;
          }
        }
      } catch (e) {
        console.warn(`⚠️ 닫기 시도 중 예외 발생 (${selector}): ${(e as Error).message}`);
        // 계속 진행
      }
    }

    console.log('ℹ️ 닫을 수 있는 모달이 존재하지 않음');
    return false;
  }
  public async waitForDomStable(timeout = 5000): Promise<void> {
    const stableThreshold = 500;
    const start = Date.now();
    let prevHtmlLength = 0;
    let stableStart = Date.now();

    while (Date.now() - start < timeout) {
      const htmlLength = await this.driver.execute(() => document.documentElement.innerHTML.length);

      if (htmlLength !== prevHtmlLength) {
        prevHtmlLength = htmlLength;
        stableStart = Date.now(); // DOM이 바뀌었으므로 안정 구간 초기화
      }

      if (Date.now() - stableStart >= stableThreshold) {
        return; // stableThreshold(ms) 동안 DOM 변경 없음 → 안정
      }

      await this.driver.pause(100);
    }

    throw new Error(`DOM이 ${timeout}ms 내에 안정화되지 않았습니다.`);
  }
  /**
   * APP 홈 메인 이동 후 모달 닫기(iOS)
   */
  public async goToHome(): Promise<void> {
    await this.driver.url(urlLocator.ios_main);

    // 페이지 로드 완료까지 기다림
    await this.driver.waitUntil(
      async () => {
        const readyState = await this.driver.execute(() => document.readyState);
        await this.driver.pause(1000);
        return readyState === 'complete';
      },
      {
        timeout: 10000,
        timeoutMsg: '❌ 페이지 로딩이 너무 오래 걸렸습니다.',
      },
    );

    // 추가적인 안정화를 위한 짧은 대기
    await this.driver.pause(1000);
    await this.closeAnyModal([...uiLocator.modal_selector]);
  }

  public async waitAndClick(selector: string, timeout = 10000): Promise<void> {
    const el = await this.driver.$(selector);
    await el.waitForDisplayed({ timeout });
    await this.driver.pause(800);
    // 클릭 가능한 상태까지 대기
    await this.driver.waitUntil(async () => await el.isClickable(), {
      timeout,
      timeoutMsg: `요소(${selector})가 ${timeout}ms 안에 클릭 가능 상태가 되지 않았습니다.`,
    });
    await el.click();
    await this.waitForPageLoad();
  }

  async getAllInnerTexts(selector: string): Promise<string[]> {
    const elements = await this.driver.$$(selector);
    const texts: string[] = [];

    for (const el of elements) {
      const isDisplayed = await el.isDisplayed();
      if (isDisplayed) {
        const text = await el.getText();
        console.log(text);
        if (text.trim() !== '') {
          texts.push(text.trim());
        }
      }
    }
    return texts;
  }

  public async getInnerText(selector: string, timeout = 5000): Promise<string | null> {
    try {
      await this.driver.pause(1000);
      await this.driver.waitUntil(
        async () => {
          const text = await this.driver.execute((sel: string) => {
            const el = document.querySelector(sel) as HTMLElement | null;
            return el?.innerText?.trim() ?? '';
          }, selector);
          return text.length > 0;
        },
        {
          timeout: 5000,
          timeoutMsg: `❌ [${selector}]의 innerText가 비어있음`,
        },
      );

      const text = await this.driver.execute((sel: string) => {
        const el = document.querySelector(sel) as HTMLElement | null;
        return el?.innerText?.trim() ?? null;
      }, selector);

      return text;
    } catch (error) {
      console.error('❌ innerText 추출 실패:', error);
      return null;
    }
  }

  private log(message: string): void {
    console.log(`[AppActions][${this.poc}] ${message}`);
  }
  //웹뷰 전환 function
  /**
   * Appium: WebView 컨텍스트 대기 및 전환
   */
  public async waitForWebViewContext(timeout = 10000): Promise<string> {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const contexts = (await this.driver.getContexts()) as string[];
      this.log(`[waitForWebViewContext] 현재 컨텍스트들: ${JSON.stringify(contexts)}`);

      const webviewCtx = contexts.find(ctx => ctx.includes('WEBVIEW'));
      if (webviewCtx) {
        this.log(`✅ WebView 컨텍스트 발견: ${webviewCtx}`);
        await this.driver.switchContext(webviewCtx);
        this.log(`🚀 WebView 컨텍스트 전환 완료`);
        return webviewCtx;
      }

      await this.driver.pause(1000);
    }

    throw new Error('❌ WebView 컨텍스트를 찾지 못했습니다.');
  }
  public async switchToWebViewWithUrlKeyword(keyword: string): Promise<boolean> {
    const contexts = await this.driver.getContexts();
    console.log(`[waitForWebViewContext] 현재 컨텍스트들: ${JSON.stringify(contexts)}`);

    for (const context of contexts) {
      const contextId = typeof context === 'string' ? context : (context as any).id;
      if (contextId.toLowerCase().includes('webview')) {
        await this.driver.switchContext(contextId);

        try {
          const url = await this.driver.getUrl();
          if (url.includes(keyword)) {
            console.log(`[WebView] 전환 성공: ${contextId} (${url})`);
            return true;
          }
        } catch {
          // URL 읽기 실패 무시하고 다음 컨텍스트로
        }
      }
    }

    return false; // 일치하는 컨텍스트가 없을 경우
  }

  public async verifyWebViewUrlContains(keyword: string): Promise<boolean> {
    try {
      // 현재 URL 조회
      const currentUrl = await this.driver.getUrl();
      console.log(`🔍 현재 WebView URL: ${currentUrl}`);

      // 키워드 포함 여부 확인
      const result = currentUrl.includes(keyword);
      if (result) {
        console.log(`✅ URL에 '${keyword}'가 포함되어 있습니다.`);
      } else {
        console.warn(`❌ URL에 '${keyword}'가 포함되어 있지 않습니다.`);
      }
      return result;
    } catch (e) {
      console.error('❌ WebView URL 확인 중 오류 발생:', e);
      return false;
    }
  }
  public async waitAndSwitchToWebViewByUrlKeyword(
    keyword: string,
    timeout = 10000,
  ): Promise<boolean> {
    const start = Date.now();
    const pollInterval = 500;

    while (Date.now() - start < timeout) {
      try {
        const contexts = await this.driver.getContexts();

        for (const context of contexts) {
          const contextId = typeof context === 'string' ? context : context.id;
          if (contextId.includes('WEBVIEW')) {
            await this.driver.switchContext(context);
            await this.driver.pause(500); // 전환 후 안정화 대기

            const url = await this.driver.execute(() => location.href).catch(() => '');
            if (typeof url === 'string' && url.includes(keyword)) {
              console.log(`✅ WebView 전환 성공: ${contextId}, URL: ${url}`);
              return true;
            }
          }
        }
      } catch (e) {
        console.warn('⚠️ 컨텍스트 전환 시도 중 예외 발생:', e);
      }

      await this.driver.pause(pollInterval);
    }

    console.error(
      `❌ WebView 전환 실패: '${keyword}'가 포함된 컨텍스트를 ${timeout}ms 내에 찾지 못함`,
    );
    return false;
  }
  /**
   * 요소 있는지 확인(상태도 같이 확인) 후 클릭
   */
  public async clickIfPresent(selector: string, timeout = 3000): Promise<void> {
    try {
      const el = await this.driver.$(selector);
      const isDisplayed = await el.isDisplayed();

      if (isDisplayed) {
        const isClickable = await el.isClickable();
        if (isClickable) {
          await el.click();
          console.log(`✅ 클릭 성공: ${selector}`);
        } else {
          console.log(`⚠️ 요소는 표시되지만 클릭 불가: ${selector}`);
        }
      } else {
        console.log(`ℹ️ 요소는 존재하지만 표시되지 않음: ${selector}`);
      }
    } catch (error) {
      // 요소가 없으면 여기로 들어옴 → 조용히 넘어감
      console.log(`ℹ️ 요소 없음 또는 클릭 실패 (무시됨): ${selector}`);
    }
  }
  public async clickAndWaitForPageLoad(selector: string, timeout = 10000): Promise<void> {
    const el = await this.driver.$(selector);

    // 클릭 가능 상태 대기 후 클릭
    await el.waitForClickable({ timeout });
    await el.click();

    // 페이지 로드 완료까지 대기
    await this.driver.waitUntil(
      async () => {
        const readyState = await this.driver.execute(() => document.readyState);
        return readyState === 'complete';
      },
      {
        timeout,
        timeoutMsg: '❌ 페이지 로딩 완료 대기 시간 초과',
      },
    );
  }
  /**
   * {text} 천천히 입력 (한문자씩)
   */
  public async typeSlowly(selector: string, text: string, delay = 100): Promise<void> {
    const el = await this.driver.$(selector);
    await el.waitForDisplayed();

    for (const char of text) {
      await el.addValue(char);
      await this.driver.pause(delay); // 각 입력 사이 딜레이
    }
  }
  /**
   * 요소들 검색하여 카운트 후 True, 0이거나 실패하면 False
   */
  public async elFind(selector: string, timeout = 5000): Promise<boolean> {
    try {
      const elements = await this.driver.$$(selector);
      const count = await elements.length;

      if (count > 0) {
        console.log('✅ 컨텐츠 개수:', count);
        return true;
      } else {
        console.log('❌ 요소 없음:', selector);
        return false;
      }
    } catch (error) {
      console.error('❌ 요소 검색 중 오류 발생:', error);
      return false;
    }
  }
  public async swipeToEnd(selector: string): Promise<void> {
    await this.driver.executeAsync((sel: string, done: () => void) => {
      const el = document.querySelector(sel);
      if (!el) return done();

      const slide = el.querySelector('.swiper-slide');
      if (!slide) return done();

      const slideWidth = slide.clientWidth;
      const maxScroll = el.scrollWidth;

      let currentScroll = el.scrollLeft;

      const scrollNext = () => {
        currentScroll += slideWidth;
        if (currentScroll > maxScroll) return done();

        el.scrollTo({ left: currentScroll, behavior: 'smooth' });

        // 다음 슬라이드로 넘어가는 시간 확보
        setTimeout(scrollNext, 800);
      };

      scrollNext();
    }, selector);

    await this.driver.pause(500); // 마지막 안정화
  }
  /**
   * 클릭 후 @param pathPart 값을 포함한 URL까지 이동할때 까지 대기
   */
  public async clickAndWait(selector: string, pathPart: string, timeout = 5000) {
    const el = await this.driver.$(selector);
    await el.click();

    await this.driver.waitUntil(async () => (await this.driver.getUrl()).includes(pathPart), {
      timeout,
      timeoutMsg: `URL이 ${timeout}ms 내에 '${pathPart}'를 포함하지 않았습니다.`,
    });
    console.log('🌐 현재 URL:', await this.driver.getUrl());
  }
  public async lastEltoClick(selector: string, timeout = 5000): Promise<void> {
    try {
      const el = await this.driver.$$(selector);
      const count = await el.length;
      console.log(el[count]);
      await el[count - 1].click();
      await this.waitForPageLoad();
    } catch (error) {
      console.error("❌ 요소 검색 중 오류 발생:'", error);
    }
    this.driver.pause(800);
  }
  public async clickUntilUrlChanges(
    selector: string,
    scroll = true,
    maxRetries = 5,
    delayMs = 1000,
  ): Promise<boolean> {
    await this.driver.pause(1000);
    let currentUrl = await this.driver.getUrl();
    let element = await this.driver.$(selector);

    for (let i = 0; i < maxRetries; i++) {
      try {
        if (scroll) {
          await element.scrollIntoView();
          await this.driver.pause(300); // scroll animation
        }

        await element.click();
        await this.driver.pause(delayMs); // 페이지 이동 기다림

        const newUrl = await this.driver.getUrl();
        console.log(`🔁 [시도 ${i + 1}] URL 비교: ${currentUrl} → ${newUrl}`);

        if (newUrl !== currentUrl) {
          console.log('✅ URL 변경 감지됨, 클릭 성공');
          await this.waitForPageLoad();
          await this.driver.pause(800); //DOM 안정화
          return true;
        }

        // URL 동일 → element 다시 정의 (DOM 리렌더링 고려)
        element = await this.driver.$(selector);
      } catch (e) {
        console.warn(`⚠️ 클릭 실패 (시도 ${i + 1}):`, (e as Error).message);
        element = await this.driver.$(selector); // 재정의 시도
      }
    }
    await this.driver.pause(1000);
    console.error(`❌ 최대 재시도 (${maxRetries}) 후에도 URL 변경 없음`);
    return false;
  }
  public async focusAndClick(selector: string, timeout = 10000): Promise<void> {
    const el = await this.driver.$(selector);

    try {
      await el.waitForExist({ timeout });

      // scroll + focus
      await this.driver.execute((sel: string) => {
        const element = document.querySelector(sel) as HTMLElement;
        if (element) {
          element.scrollIntoView({ block: 'center', behavior: 'instant' });
          element.focus();
        }
      }, selector);

      await this.driver.pause(500);

      const isDisplayed = await el.isDisplayed();
      if (!isDisplayed) {
        throw new Error(`요소(${selector})가 화면에 보이지 않습니다.`);
      }

      await el.waitForClickable({ timeout });
      await el.click();

      await this.waitForPageLoad();
      await this.waitForDomStable();
    } catch (err: any) {
      throw new Error(`[forceClick 오류] ${selector} 클릭 실패: ${err.message}`);
    }
  }

  public async moveClick(selector: string): Promise<void> {
    const element =
      selector.startsWith('/') || selector.startsWith('(')
        ? await this.driver.$(`xpath=${selector}`)
        : await this.driver.$(selector);

    await element.waitForExist({ timeout: 10000 });

    try {
      await this.driver.execute((sel: string) => {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
      }, selector);
    } catch {
      // Native context (e.g., 앱 Native 화면)에서는 DOM 접근이 불가하므로 무시
    }

    await this.driver.pause(800);

    try {
      await element.click();
    } catch (e) {
      console.warn(`[moveToClick] 1차 클릭 실패, 재시도: ${e}`);
      await this.driver.pause(1000);
      await element.click();
    }

    await this.driver.pause(800); // waitLoading() 함수가 정의되어 있다면 실행
  }
  /**
   * 탭 list 셀렉터 모두 클릭 하는 함수
   * ..
   */
  public async clickAllTabsSequentially(selector: string): Promise<void> {
    try {
      const tabs = await this.driver.$$(selector);
      const count = await tabs.length;

      if (count === 0) {
        console.warn(`⚠️ 클릭할 탭이 없습니다: ${selector}`);
        return;
      }

      for (let i = 0; i < count; i++) {
        const tab = tabs[i];
        await tab.scrollIntoView();
        await tab.waitForDisplayed({ timeout: 5000 });
        await tab.click();
        await this.driver.pause(1000); // 클릭 후 대기 (옵션)
        await this.waitForPageLoad();
      }
      console.log('탭 리스트 클릭 완료');
    } catch (error) {
      console.error(`❌ 탭 클릭 중 오류 발생:`, error);
    }
  }
  public async randomChoice(selector: string): Promise<void> {
    try {
      const elements = await this.driver.$$(selector);
      const count = await elements.length;

      if (count === 0) {
        console.warn(`⚠️ 요소가 없습니다: ${selector}`);
        return;
      }

      const randomIndex = Math.floor(Math.random() * count);
      const target = elements[randomIndex];

      await target.scrollIntoView();
      await target.waitForClickable({ timeout: 5000 });
      const el_text = await elements[randomIndex].getText();
      await target.click();
      console.log(`✅ 랜덤 요소 클릭 성공 - 인덱스: ${randomIndex}, `, el_text);
    } catch (error) {
      console.error(`❌ 랜덤 요소 클릭 중 오류 발생:`, error);
    }
  }
  public async scrollSlideIntoView(
    wrapperElement: ChainablePromiseElement,
    localIndex: number,
  ): Promise<void> {
    const slides = await wrapperElement.$$('.swiper-slide');
    const target = slides[localIndex];
    await this.driver.pause(800);
    await this.driver.execute(
      (el: HTMLElement) => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      (await target) as unknown as HTMLElement,
    );

    await this.driver.pause(1000);
  }
  //요소 찾아서 있으면 true 반환, 없으면 false 반환
  public async isElementPresent(selector: string, timeout = 5000): Promise<boolean> {
    try {
      await this.driver.pause(500); //실행전 돔 안정화
      const el = await this.driver.$(selector);
      const text = el.getText();
      console.log(' 🚀 요소 존재');
      return true;
    } catch {
      console.log('요소 찾을수 없음');
      return false;
    }
  }
  /**
   * 포커스 및 강제 클릭
   */
  async iosClick(selector: string, timeout = 10000): Promise<void> {
    try {
      const el = await this.driver.$(selector);

      // 존재 여부 확인
      await el.waitForExist({ timeout });

      // JS로 focus 및 클릭 시도
      await this.driver.execute(sel => {
        const element = document.querySelector(sel) as HTMLElement;
        if (!element) throw new Error(`선택자 ${sel}로 요소를 찾을 수 없습니다.`);
        element.scrollIntoView({ behavior: 'auto', block: 'center' });
        element.focus();
        element.click();
      }, selector);

      console.log(`[Click] ${selector} 클릭 성공`);
    } catch (e) {
      console.warn(`[Click 오류] ${selector} 클릭 실패: ${e}`);
    }
    await this.driver.pause(1000); //클릭 안정화
  }
  /**
   * Element 요소 있는지 체크
   */
  async isElementCheck(selector: string, timeout = 10000): Promise<boolean> {
    const el = await this.driver.$(selector);
    const checkEl = await el.waitForExist({ timeout });
    console.log(checkEl);
    if (checkEl) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * 웹뷰 안전하게 전환하기
   */
  public async waitForWebViewContextV2(timeout = 10000): Promise<string> {
    const pollInterval = 500;
    const maxTries = Math.ceil(timeout / pollInterval);
    let attempts = 0;

    while (attempts < maxTries) {
      try {
        const contexts = await this.driver.getContexts();

        // 이름만 추출
        const contextNames: string[] = contexts.map((ctx: any) => {
          return typeof ctx === 'string' ? ctx : ctx.id || ctx.name || '';
        });

        this.log(`[waitForWebViewContext] 컨텍스트들: ${JSON.stringify(contextNames)}`);

        const webviewCtx = contextNames.find(name => name.includes('WEBVIEW'));

        if (webviewCtx) {
          this.log(`✅ WebView 컨텍스트 발견: ${webviewCtx}`);
          await this.driver.switchContext(webviewCtx);
          this.log(`🚀 WebView 컨텍스트 전환 완료`);
          return webviewCtx;
        }
      } catch (err) {
        this.log(
          `❗ 컨텍스트 조회 오류 (시도 ${attempts + 1}/${maxTries}): ${(err as Error).message}`,
        );
      }

      await this.driver.pause(pollInterval);
      attempts++;
    }

    throw new Error(`❌ ${timeout}ms 안에 WebView 컨텍스트를 찾지 못했습니다.`);
  }
  /**
   * 웹뷰 안전하게 전환하기
   */
  public async waitForTargetWebViewContext(urlKeyword: string, timeout = 10000): Promise<string> {
    const pollInterval = 500;
    const maxTries = Math.ceil(timeout / pollInterval);
    let attempts = 0;

    while (attempts < maxTries) {
      try {
        const contexts = await this.driver.getContexts();

        for (const ctx of contexts) {
          const contextName =
            typeof ctx === 'string' ? ctx : (ctx as any).id || (ctx as any).name || '';

          if (contextName.includes('WEBVIEW')) {
            await this.driver.switchContext(contextName);

            const currentUrl = await this.driver.getUrl();

            if (currentUrl.includes(urlKeyword)) {
              this.log(`✅ URL 조건 만족: ${currentUrl}`);
              return contextName;
            } else {
              this.log(`⏭️ URL 미일치: ${currentUrl}`);
            }
          }
        }
      } catch (err) {
        this.log(`⚠️ 컨텍스트 처리 중 오류: ${(err as Error).message}`);
      }

      await this.driver.pause(pollInterval);
      attempts++;
    }

    throw new Error(
      `❌ ${timeout}ms 내에 URL "${urlKeyword}"을 포함하는 WebView 컨텍스트를 찾지 못했습니다.`,
    );
  }
  /**
   * target URL 포함하는 웹뷰로 전환 후 True반환
   */
  public async switchToWebViewByUrl(targetUrlPart: string, timeout = 10000): Promise<boolean> {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const contexts = await this.driver.getContexts();

      for (const context of contexts) {
        if (typeof context === 'string' && context.includes('WEBVIEW')) {
          try {
            // 1. 컨텍스트 전환
            await this.driver.switchContext(context);
            await this.driver.pause(500); // 전환 후 안정화 대기

            // 2. 현재 URL 확인
            const url = await this.driver.getUrl();
            console.log(`[WebView 탐색] context=${context}, url=${url}`);

            // 3. URL 일치 여부 확인
            if (url.includes(targetUrlPart)) {
              console.info(`[WebView 전환 성공] ${context} (URL: ${url})`);
              return true;
            }
          } catch (err) {
            console.warn(`[WebView 전환 실패] ${context}: ${(err as Error).message}`);
          }
        }
      }

      await this.driver.pause(1000);
    }

    console.warn(
      `[WebView 전환 실패] ${timeout}ms 내에 URL "${targetUrlPart}" 포함 WebView를 찾지 못함`,
    );
    return false;
  }
  /**
   * 현재 URL에 포함여부 확인
   */
  public async isCurrentUrlIncludes(param: string): Promise<boolean> {
    try {
      const url = await this.driver.getUrl();
      console.log(`[현재 URL 확인]: ${url}`);

      if (url.includes(param)) {
        console.info(`✅ 현재 URL에 "${param}" 포함됨`);
        return true;
      } else {
        console.warn(`❌ 현재 URL에 "${param}" 없음`);
        return false;
      }
    } catch (error) {
      console.error(`[URL 포함 여부 확인 중 오류]`, error);
      return false;
    }
  }
  /**
   * 지정된 셀렉터로 찾아낸 요소들 중 innerText에 특정 단어가 포함된 개수 반환
   * @param selector CSS 또는 XPath 셀렉터 (예: 'li', 'div.item')
   * @param keyword 포함되어야 할 문자열 (예: '혜택', '로그인')
   */
  public async hasElementContainingText(selector: string, keyword: string): Promise<boolean> {
    try {
      const innerTexts: string[] = await this.driver.execute((sel: string) => {
        const els = Array.from(document.querySelectorAll(sel));
        return els.map(el => (el as HTMLElement).innerText || '');
      }, selector);

      let count = 0;
      for (const text of innerTexts) {
        console.log(text);
        if (text.includes(keyword)) {
          count++;
        }
      }

      console.info(`🔍 "${keyword}" 포함 요소 수: ${count}`);
      return count > 0;
    } catch (error) {
      console.error(`요소 텍스트 확인 중 오류 발생`, error);
      return false;
    }
  }
  /**
   * 일정시간 대기하여 돔 안정화 되는 함수
   */
  public async isDelay(): Promise<void> {
    await this.driver.pause(1200);

    await this.driver.pause(1300);
  }
  /**
   * targetUrl로 안전하게 웹뷰 전환
   */
  public async switchToWebViewByUrlSafe(targetUrlPart: string, timeout = 10000): Promise<boolean> {
    const start = Date.now();
    let lastError: Error | null = null;

    while (Date.now() - start < timeout) {
      try {
        const contexts = await this.driver.getContexts();
        for (const context of contexts) {
          if (typeof context === 'string' && context.includes('WEBVIEW')) {
            await this.driver.switchContext(context);
            const currentUrl = await this.driver.getUrl();

            if (currentUrl.includes(targetUrlPart)) {
              console.info(`[✅ WebView 전환 성공] ${context} (URL: ${currentUrl})`);
              return true;
            }
          }
        }
      } catch (e: any) {
        lastError = e;
        console.warn(`[⏳ WebView 전환 재시도 중...]: ${e.message}`);
      }
      // 매 루프마다 pause (하드 wait은 루프 내부에서만)
      await this.driver.pause(1000);
    }
    console.warn(
      `[❌ WebView 전환 실패] ${timeout}ms 내에 '${targetUrlPart}' 포함 URL을 찾지 못함`,
    );
    if (lastError) console.warn('마지막 오류:', lastError.message);
    return false;
  }
  /**
   * 배열이 모두 True인지 확인
   */
  public async allTrue(results: boolean[]): Promise<boolean> {
    const isAllTrue = results.every(result => result === true);
    console.info(`전체 결과가 true인가? ${isAllTrue}`);
    return isAllTrue;
  }
  /**
   * 지정된 셀렉터로 찾아낸 요소들 중 innerText에 특정 단어가 포함된 개수 반환
   * @param selector CSS 셀렉터 (예: 'li', 'div.item')
   * @param keyword 포함되어야 할 문자열 (예: '혜택', '로그인')
   */
  public async elementsContainingText(selector: string, keyword: string): Promise<number> {
    try {
      const innerTexts: string[] = await this.driver.execute((sel: string) => {
        const els = Array.from(document.querySelectorAll(sel));
        return els.map(el => (el as HTMLElement).innerText || '');
      }, selector);

      let count = 0;
      for (const text of innerTexts) {
        console.log(text);
        if (text.includes(keyword)) {
          count++;
        }
      }

      console.info(`🔍 "${keyword}" 포함 요소 수: ${count}`);
      return count;
    } catch (error) {
      console.error(`요소 텍스트 확인 중 오류 발생`, error);
      return 0;
    }
  }
  public async randomChoiceReturnText(selector: string): Promise<string | null> {
    try {
      const elements = await this.driver.$$(selector);
      const count = await elements.length;

      if (count === 0) {
        console.warn(`⚠️ 요소가 없습니다: ${selector}`);
        return null;
      }

      const randomIndex = Math.floor(Math.random() * count);
      const target = elements[randomIndex];

      await target.scrollIntoView();
      await target.waitForClickable({ timeout: 5000 });

      const el_text = await target.getText();
      await target.click();

      console.log(`✅ 랜덤 요소 클릭 성공 - 인덱스: ${randomIndex}, 텍스트: ${el_text}`);
      return el_text;
    } catch (error) {
      console.error(`❌ 랜덤 요소 클릭 중 오류 발생:`, error);
      return null;
    }
  }
  public async elFindCount(selector: string, timeout = 10000): Promise<Number> {
    try {
      const elements = await this.driver.$$(selector);
      const count = await elements.length;

      if (count > 0) {
        console.log('✅ 컨텐츠 개수:', count);
        return count;
      } else {
        console.log('❌ 요소 없음:', selector);
        return 0;
      }
    } catch (error) {
      console.error('❌ 요소 검색 중 오류 발생:', error);
      return 0;
    }
  }

  //aos 네이티브 모달을 닫음

  async nativeModal() {
    try {
      await this.click('//android.widget.Button[@text="닫기"]');
    } catch (e) {}
  }

  async scrollToVisible(selector: string, maxTries: number = 5): Promise<boolean> {
    for (let i = 0; i < maxTries; i++) {
      // 1. 요소가 화면에 나타나는지 확인
      const el = await this.driver.$(selector);
      const isExisting = await el.isExisting().catch(() => false);

      if (isExisting) {
        console.log('요소를 찾았습니다');
        return true; // 찾음
      }

      // 2. 아래로 스크롤
      await this.scroll(0.9);
      await this.driver.pause(300); // 스크롤 후 렌더링 대기(필요시)
    }
    return false; // 못찾음
  }

  /**
   * 우측으로 400 스와이프(400이 보통 한페이지)
   * await this.swipe(element); // 기본 400 이동
   */

  async swipe(
    selector: string,
    pageWidth: number = 400, // 오른쪽으로 400px 이동
    offset: number = 50,
  ): Promise<void> {
    await this.driver.execute(
      (sel: string, dx: number, rightOffset: number) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.scrollIntoView({ block: 'center', inline: 'start', behavior: 'auto' });

        // 오른쪽 스와이프: scrollLeft 값을 증가시킴
        if (typeof (el as any).scrollLeft === 'number' && rightOffset > 0) {
          (el as any).scrollLeft = (el as any).scrollLeft + rightOffset;
        }
        if (typeof (el as any).scrollBy === 'function') {
          (el as any).scrollBy(Math.abs(dx), 0); // dx를 반드시 양수로!
        } else {
          window.scrollBy(Math.abs(dx), 0);
        }
      },
      selector,
      pageWidth,
      offset,
    );
    await this.driver.pause(200);
  }

  /**
   * 우측으로 특정요소가 보일때까지 스와이프.컨테이너 요소, 타겟요소<< 찾을때까지 반복
   * const found = await this.swipeUntilVisible(deviceTabListWrapper, deviceSwipeList[tabIndex]);
   * deviceTabListWrapper=스와이프 대상, deviceSwipeList[tabIndex] 찾고자 하는요소
   */
  async swipeUntilVisible(
    selector: string,
    targetSelector: string,
    maxTries: number = 5,
  ): Promise<boolean> {
    for (let i = 0; i < maxTries; i++) {
      // 타겟 요소가 화면에 있는지 확인
      const target = await this.driver.$(targetSelector);
      const isVisible = await target.isDisplayed().catch(() => false);

      if (isVisible) {
        console.log(`[swipeUntilVisible] 타겟이 ${i + 1}번째에 노출됨`);
        return true;
      }

      // 안 보이면 스와이프
      await this.swipe(selector); // dx 기본값(400) 사용
      await this.driver.pause(300); // 살짝 대기
    }
    console.warn(`[swipeUntilVisible] ${maxTries}번 시도 후에도 요소가 안 보임`);
    return false;
  }
  public async clickJs(selector: string): Promise<void> {
    await this.driver.execute(sel => {
      const el = document.querySelector(sel) as HTMLElement;
      if (el) el.click();
    }, selector);
  }

  //선택한 요소가 보일때까지 wait. 요소가 없으면 무시
  public async waitTry(target: string | Awaited<ReturnType<Browser['$']>>): Promise<void> {
    try {
      type WDElement = Awaited<ReturnType<Browser['$']>>;
      const el: WDElement = typeof target === 'string' ? await this.driver.$(target) : target;
      await el.waitForDisplayed({
        timeout: 1000,
        timeoutMsg: `"${typeof target === 'string' ? target : 'element'}" 요소가 표시되지 않습니다.`,
      });
    } catch (e) {
      // 에러 무시
    }
  }
  /**
   * 두 텍스트가 동일한지 비교 (공백 제거 포함)
   * @returns 동일하면 true, 아니면 false
   */
  public async isTextEqual(
    text1: string | null | undefined,
    text2: string | null | undefined,
  ): Promise<boolean> {
    if (typeof text1 !== 'string' || typeof text2 !== 'string') {
      console.log(text1, '불일치', text2);
      return false;
    }
    console.log('텍스트 일치', text1, text2);
    return text1.trim() === text2.trim();
  }
  /**
   * swiper-slide 요소 셀렉터 존재하는 element 스와이프 하기
   *
   */
  public async swipeToEl(selector: string): Promise<void> {
    await this.driver.executeAsync((sel: string, done: () => void) => {
      const el = document.querySelector(sel);
      if (!el) return done();

      const slide = el.querySelector('.swiper-slide');
      if (!slide) return done();

      const slideWidth = slide.clientWidth;
      const maxScroll = el.scrollWidth;

      let currentScroll = el.scrollLeft;

      const scrollNext = () => {
        currentScroll += slideWidth;
        if (currentScroll > maxScroll) return done();

        el.scrollTo({ left: currentScroll, behavior: 'smooth' });

        // 다음 슬라이드로 넘어가는 시간 확보
        setTimeout(scrollNext, 800);
      };

      scrollNext();
    }, selector);

    await this.driver.pause(500); // 마지막 안정화
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
  public async runTestSteps(steps: Array<() => Promise<boolean>>): Promise<boolean> {
    const resolvedLabel = this.getCallerFunctionName();
    console.info(`[${resolvedLabel}] 테스트 시작`);

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
      console.info(`[${resolvedLabel}] 테스트 성공\ntestResults: ${testResults}`);
      return true;
    } else {
      console.info(`[${resolvedLabel}] 테스트 실패\ntestResults: ${testResults}`);
      return false;
    }
  }
  public async focusToClick(selector: string, timeout = 5000): Promise<void> {
    const el = await this.driver.$(selector);
    await el.waitForExist({ timeout });

    // // 1. 스크롤 및 위치 보정
    // await this.driver.execute((sel: string) => {
    //   const element = document.querySelector(sel) as HTMLElement;
    //   if (!element) throw new Error(`Selector not found: ${sel}`);
    //   element.scrollIntoView({ behavior: 'instant', block: 'center' });
    //   element.style.display = 'block'; // visibility hack
    // }, selector);

    // 2. focus 후 강제 클릭
    try {
      await this.driver.execute((sel: string) => {
        const element = document.querySelector(sel) as HTMLElement;
        if (!element) throw new Error(`Selector not found: ${sel}`);
        element.focus();
        element.click();
      }, selector);
    } catch (e) {
      throw new Error(
        `[forceClick 오류] ${selector} 클릭 실패: ${e instanceof Error ? e.message : e}`,
      );
    }
  }
  public async imgCheck(selector: string): Promise<boolean> {
    try {
      const context = await this.driver.getContext();
      console.log(`[DEBUG] 현재 컨텍스트: ${context}`);

      if (typeof context === 'string' && !context.includes('WEBVIEW')) {
        console.warn(`❌ 현재 WebView 컨텍스트가 아님. selector: ${selector}`);
        return false;
      }

      // scrollIntoView는 JS로 안전하게
      await this.driver.execute((sel: string) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, selector);

      // 이미지 요소 탐색
      const elements = await this.driver.$$(selector);
      if (!elements || (await elements.length) === 0) {
        console.warn(`❌ 이미지 요소 없음: ${selector}`);
        return false;
      }

      for (let i = 0; i < (await elements.length); i++) {
        const visible = await elements[i].isDisplayed();
        if (!visible) {
          console.warn(`❌ 이미지 ${i + 1}번째 요소가 보이지 않음`);
          return false;
        }
      }

      console.log(`✅ 이미지 ${elements.length}개 모두 정상 표시됨`);
      return true;
    } catch (err) {
      console.error(`❌ safeImgCheck 오류`, err);
      return false;
    }
  }
  /**
   * 요소 내 텍스트에 특정 텍스트(들)가 포함되어 있는지 확인
   */
  public async textCheck(selector: string, textList: string | string[]): Promise<boolean> {
    try {
      const el = await this.driver.$(selector);
      // await el.waitForDisplayed({ timeout: 10000 });

      const rawText = await el.getText();
      const text = rawText.replace(/\s+/g, '').trim();

      if (typeof textList === 'string') {
        const cleaned = textList.replace(/\s+/g, '').trim();
        console.log(`[checkText] text: ${text}, expected: ${cleaned}`);
        if (!text.includes(cleaned)) {
          console.warn(`❌ '${cleaned}' 포함되지 않음`);
          return false;
        }
      } else {
        const cleanedList = textList.map(item => item.replace(/\s+/g, '').trim());
        console.log(`[checkText] text: ${text}, expected list: ${cleanedList}`);
        for (const item of cleanedList) {
          if (!text.includes(item)) {
            console.warn(`❌ '${item}' 포함되지 않음`);
            return false;
          }
        }
      }

      console.log('✅ 모든 텍스트 포함 확인 완료');
      return true;
    } catch (error) {
      console.error('❌ checkText 실패:', error);
      return false;
    }
  }
  /**
   * 주어진 selector의 요소들 중 랜덤으로 하나를 선택하고,
   * 해당 요소의 고유한 CSS selector를 반환합니다.
   */
  public async getRandomSelector(baseSelector: string): Promise<string | null> {
    try {
      const elements = await this.driver.$$(baseSelector);
      const count = await elements.length;

      if (count === 0) {
        console.warn(`⚠️ 요소 없음: ${baseSelector}`);
        return null;
      }

      const randomIndex = Math.floor(Math.random() * count);
      const targetElement = elements[randomIndex];

      // 해당 요소의 위치 기반으로 고유 셀렉터 생성
      const selector = `${baseSelector}:nth-of-type(${randomIndex})`;

      console.log(`[getRandomSelector] : ${selector}`);
      return selector;
    } catch (error) {
      console.error(`[getRandomSelector 오류]:`, error);
      return null;
    }
  }
  /**
   * nth-of-type(1)
   * 해당 요소의 고유한 CSS selector를 반환합니다.
   */
  public async getNthSelector(baseSelector: string): Promise<string | null> {
    try {
      const elements = await this.driver.$$(baseSelector);
      const count = await elements.length;

      if (count === 0) {
        console.warn(`⚠️ 요소 없음: ${baseSelector}`);
        return null;
      }

      const Index = 1;
      const targetElement = elements[Index];

      // 해당 요소의 위치 기반으로 고유 셀렉터 생성
      const selector = `${baseSelector}:nth-of-type(${Index})`;

      console.log(`[getRandomSelector] : ${selector}`);
      return selector;
    } catch (error) {
      console.error(`[getRandomSelector 오류]:`, error);
      return null;
    }
  }
  /**
   * 해당 셀렉터 요소 중 마지막 요소 셀렉터 반환(CSS)
   * 해당 요소의 고유한 CSS selector를 반환합니다.
   */
  public async lastElSelector(baseSelector: string): Promise<string | null> {
    try {
      const elements = await this.driver.$$(baseSelector);
      const count = await elements.length;

      if (count === 0) {
        console.warn(`⚠️ 요소 없음: ${baseSelector}`);
        return null;
      }

      const lastIndex = count - 1;
      const targetElement = elements[lastIndex];

      // 해당 요소의 위치 기반으로 고유 셀렉터 생성
      const selector = `${baseSelector}:nth-of-type(${lastIndex})`;

      console.log(`[getRandomSelector] : ${selector}`);
      return selector;
    } catch (error) {
      console.error(`[getRandomSelector 오류]:`, error);
      return null;
    }
  }
  /**
   * Description : 주어진 셀렉터로 일치하는 요소 중 랜덤 하나를 scrollIntoView로 스와이프 포커스
   * @param selector 예: '.tab-panel li strong'
   */
  public async swipeToRandomElement(selector: string): Promise<void> {
    try {
      const elements = await this.driver.$$(selector);
      const count = await elements.length;

      if (count === 0) {
        console.warn(`❌ 요소 없음: ${selector}`);
      }
      console.log(count);
      // 랜덤 인덱스 (0부터 최대 2까지만)
      const safeCount = Math.min(3, count); // 요소가 4개 미만일 수 있음
      // const randomIndex = Math.floor(Math.random() * safeCount);
      const randomIndex = Math.floor(1);
      console.log(randomIndex);
      // nth-of-type은 1부터 시작함
      const cssSelector = `${selector}:nth-of-type(${randomIndex})`;
      console.log(cssSelector);
      const targetEl = await this.driver.$(cssSelector);
      await this.driver.execute(
        (targetEl: HTMLElement) => targetEl.scrollIntoView({ block: 'center', behavior: 'auto' }),
        targetEl as unknown as HTMLElement,
      );
      console.log(`✅ 랜덤 요소(${randomIndex})로 스와이프 포커스 완료: ${cssSelector}`);
      await this.driver.pause(500);
      await targetEl.waitForClickable({ timeout: 5000 });
      await targetEl.click();
      // return cssSelector;
    } catch (error) {
      console.error(`❌ swipeToRandomElement 실패:`, error);
      // return null;
    }
  }
  /**
   * 실제 텍스트에 기대 텍스트가 포함되어 있는지 여부를 확인
   * @param actual 실제 텍스트 (예: getText 결과)
   * @param expected 기대하는 텍스트 (예: 비교 대상)
   * @returns 포함되면 true, 아니면 false
   */
  public isTextContains(actual: string, expected: string): boolean {
    const actualTrimmed = actual.trim();
    const expectedTrimmed = expected.trim();

    const result = actualTrimmed.includes(expectedTrimmed);
    console.log(
      `[텍스트 비교] 실제: "${actualTrimmed}" | 기대: "${expectedTrimmed}" → 포함 여부: ${result}`,
    );
    return result;
  }
  public async webElementGetInnerText(
    element: ChainablePromiseElement,
    timeout = 5000,
  ): Promise<string> {
    try {
      await element.waitForDisplayed({ timeout: 5000 });

      let text = await element.getText();
      if (!text.trim()) {
        text = await this.driver.execute(el => (el as unknown as HTMLElement).innerText, element);
      }
      return text.trim();
    } catch (e) {
      console.warn(`❌ 텍스트 추출 실패`, e);
      return '';
    }
  }
}
