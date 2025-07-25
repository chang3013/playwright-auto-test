/**
 * Description : TestStepsMap.ts - 테스트 개발자의 spec/page/method 조립을 가능하게 지원하는 클래스
 * Author : Shiwoo Min
 * Date : 2025-05-07
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import type { Page } from '@playwright/test';
import type winston from 'winston';

export class TestStepsMap {
  private static readonly poc = POCEnv.getType();
  private static readonly logger = Logger.getLogger(this.poc) as winston.Logger;

  private stepMap: Map<string, Map<string, (page: Page) => Promise<void>>> = new Map();

  /**
   * 특정 spec/page에 대해 step function 추가
   */
  public addStep(
    spec: string,
    page: string,
    fnName: string,
    fn: (page: Page) => Promise<void>,
  ): void {
    const specKey = spec.toLowerCase();
    const fullKey = `${page}.${fnName}`;

    if (!this.stepMap.has(specKey)) {
      this.stepMap.set(specKey, new Map());
    }
    this.stepMap.get(specKey)?.set(fullKey, fn);

    TestStepsMap.logger.debug(`Step added: ${specKey}:${fullKey}`);
  }

  /**
   * TEST_PARTS = main:goToMain,search:searchItem 와 같은 형식으로 지정된 스텝을 지정 순서대로 실행
   */
  public async runSelectedSteps(page: Page, parts: string[]): Promise<void> {
    for (const part of parts) {
      const [specKey, methodName] = part.split(':');
      const spec = specKey?.toLowerCase();
      const methodMap = this.stepMap.get(spec);

      if (!methodMap) {
        TestStepsMap.logger.warn(`Spec '${spec}' not found.`);
        continue;
      }

      const fn = [...methodMap.entries()].find(([fullName]) => fullName.endsWith(methodName))?.[1];

      if (!fn) {
        TestStepsMap.logger.warn(`Method '${methodName}' not found in spec '${spec}'`);
        continue;
      }

      TestStepsMap.logger.info(`Running: ${spec}:${methodName}`);
      await fn(page);
    }
  }

  /**
   * 모든 목록을 표시 (dry-run, debug할 때)
   */
  public listAllSteps(): void {
    for (const [spec, methods] of this.stepMap.entries()) {
      for (const [methodName] of methods.entries()) {
        TestStepsMap.logger.info(`Registered: ${spec}:${methodName}`);
      }
    }
  }
}
