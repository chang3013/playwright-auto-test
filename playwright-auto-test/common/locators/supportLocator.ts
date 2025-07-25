import { UIType } from '@common/types/platform-types';

export const supportLocator = {
  // 고객지원
  supportPage: {
    PC: '.c-content-wrap',
    MOBILE: '',
    APP: '',
  },

  supportNative: {
    PC: '.c-content-wrap',
    MOBILE: '',
    APP: '',
  },

  // 고객지원 > 자주 찾는 검색어
  searchTerm: {
    PC: '.keyword-link a',
    MOBILE: '.support-main-search-tag a',
    APP: 'div.c-inpform > div.c-inpitem > input[placeholder="자주 찾는 검색어"]',
  },
  iosSearchTerm: '.support-main-search-tag a',
  favoriteTerm: '.support-main-search-tag',
  searchList: '.c-acc-tit',
  searchFavorite: '.support-main-search-tag span:first-child a',
  // 고객지원 > 자주 찾는 검색어1
  searchTerm1: {
    PC: '',
    MOBILE: '',
    APP: 'div.support-main-search-tag >span > a[title="번호변경"] > span.underline',
  },

  // 고객지원 > 자주 찾는 검색어 > 검색 결과
  searchResult: {
    PC: '.faq-title',
    MOBILE: '.c-text-type-title',
    APP: '.c-text-type-title',
  },
  faqListSection: '.accordion',
  faqList: '.c-accordion-group',
  faqList2: '.collapse',
  faqBtn: '//div[@variant="primary"]',
  questionListSection: 'div[class="section-wide login-after"]',

  // 고객지원 > 도움이 될 내용 리스트
  questionList: {
    PC: '.cs-intro-1-wrap button',
    MOBILE: '.c-bullet-type-question a',
    APP: '.c-bullet-type-question a[title="사용 중인 요금제와 부가서비스를 확인하고 싶어요."]',
  },
  iosQuestionList: '.c-bullet-type-question a',

  // 고객지원 > 간편 해결
  solution: {
    PC: '.cs-intro-2-wrap img',
    MOBILE: '.submain-section > div > div:nth-of-type(4) .swiper-wrapper img',
    APP: 'div.swiper-slide.swiper-slide-active > a.c-card-box.w320 > div.info-img.video-player > img',
  },

  // 고객지원 > 간편 해결 > 더보기
  solutionMoreBtn: {
    PC: '.cs-intro-2-wrap div > a',
    MOBILE: '',
    APP: '',
  },

  // 고객지원 > 이용 가이드
  guide: {
    PC: '.cs-intro-3-wrap > div > div',
    MOBILE: '.submain-section > div:nth-of-type(2) li:nth-of-type(1) a',
    APP: 'div.c-card-box-7.c-ico-info-use-guide > div.info-box > div.info-top > a',
  },

  // 고객지원 > 이용 가이드 > 탭 리스트
  guideTab: {
    PC: '',
    MOBILE: 'ul[role="tablist"]',
    APP: 'ul[role="tablist"]',
  },

  supportGnB: 'button[data-gtm-click-text="고객지원"]',
  supportSubMain: 'img[alt="고객지원"]',
  supportUrl: '/use-guide',
} as const;

// 전체 타입
export type UILocator = typeof supportLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
