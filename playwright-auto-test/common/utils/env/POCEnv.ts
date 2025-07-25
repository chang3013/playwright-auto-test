import { getAllPOCValues, isValidPOCValue, POCValueToKey } from '@common/types/platform-types';
import type { POCUpper, ValidPOCValue } from '@common/types/platform-types';

export class POCEnv {
  /**
   * 현재 설정된 환경변수 POC 값 반환 (원시 문자열)
   */
  public static getRawValue(): string {
    return process.env.POC?.toLowerCase().trim() || 'all';
  }

  /**
   * 유효한 POCValue 반환 (검증된 경우만)
   * - all이면 null 반환
   */
  public static getSafeValue(): ValidPOCValue | null {
    const raw = this.getRawValue();
    if (raw === 'all') return null;
    return isValidPOCValue(raw) ? raw : null;
  }

  /**
   * 현재 설정된 POC 타입 반환 (all이면 예외 발생)
   */
  public static getType(): ValidPOCValue {
    const value = this.getSafeValue();
    if (!value) {
      throw new Error(
        '[POCEnv] 유효하지 않은 POC 환경변수입니다. POC=pc|mw|aos|ios 중 하나를 설정하세요.',
      );
    }
    return value;
  }

  /**
   * 현재 실행 중인 POC 대문자 Key 반환 ('PC', 'AOS', ...)
   * - all일 경우 'GLOBAL' 반환
   */
  public static getKey(): POCUpper | 'GLOBAL' {
    const value = this.getSafeValue();
    if (!value) return 'GLOBAL';
    return POCValueToKey[value];
  }

  /**
   * 실행 대상 POC 리스트
   * - 단일 실행이면 해당 POC만
   * - 전체 실행이면 전체 POC 리스트 반환
   */
  public static getPOCList(): ValidPOCValue[] {
    const value = this.getSafeValue();
    return value ? [value] : getAllPOCValues();
  }

  /**
   * 실행 대상 POC 대문자 키 리스트 (e.g. ['PC', 'MW', 'IOS', 'AOS'])
   */
  public static getPOCKeyList(): POCUpper[] {
    return this.getPOCList().map(v => POCValueToKey[v]);
  }

  /**
   * 전체 실행 여부 확인
   */
  public static isAll(): boolean {
    return this.getSafeValue() === null;
  }

  /**
   * 특정 POC 실행 여부
   */
  public static isPOC(target: POCUpper): boolean {
    return this.getPOCKeyList().includes(target);
  }

  /**
   * 현재 설정값 디버깅 출력
   */
  public static printPOCInfo(): void {
    const raw = this.getRawValue();
    const key = this.getKey();
    const list = this.getPOCKeyList().join(', ');
    console.log(`[POCEnv] POC 설정값: "${raw}" | 키: ${key} | 실행 대상: [${list}]`);
  }

  /**
   * 전체 유효한 POC 값 리스트 반환
   */
  public static getAllPOCValues(): ValidPOCValue[] {
    return getAllPOCValues();
  }
}
