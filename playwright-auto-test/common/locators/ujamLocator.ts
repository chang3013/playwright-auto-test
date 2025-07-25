import { UIType } from '@common/types/platform-types';

export const ujamLocator = {
  // 유잼 서브메인 > KV
  kvSection: {
    PC: '.submain-section section:nth-of-type(1)',
    MOBILE: '',
    APP: '',
  },
  benefitBtn: {
    PC: '',
    MOBILE: '',
    APP: 'button[data-gtm-click-text="혜택/멤버십"]',
  },
  servicePlus: 'a[data-gtm-click-text="혜택/멤버십|서비스+"]',
  ujamMenu: 'a[data-gtm-click-text="혜택/멤버십|서비스+|유잼"]',
  ujamUrl: {
    PC: '',
    MOBILE: '',
    APP: '/ujam',
  },
} as const;

// 전체 타입
export type UILocator = typeof ujamLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
