import { UIType } from '@common/types/platform-types';

export const udocLocator = {
  // 유독 서브메인 > KV
  kvSection: {
    PC: '.slider .udoc-slick',
    MOBILE: '',
    APP: '',
  },
  udocMenu: {
    PC: '',
    MOBILE: '',
    APP: 'button[data-gtm-click-text="유독"]',
  },
  udocUrl: {
    PC: '',
    MOBILE: '',
    APP: '/pogg/main',
  },
} as const;

// 전체 타입
export type UILocator = typeof udocLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
