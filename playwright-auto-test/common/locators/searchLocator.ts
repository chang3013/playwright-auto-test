import { UIType } from '@common/types/platform-types';

export const searchLocator = {
  // 검색 > 인기검색어
  rankingKeyword: {
    PC: '',
    MOBILE: '',
    APP: '.c-inpitem > button.c-inp',
  },

  // 검색 > 인기검색어 > 검색어
  keyword: {
    PC: '.ranking-list li a',
    MOBILE:
      '//div[contains(@class, "c-keyword-wrap") and .//p[@class="h4" and text()="인기 검색어"]]//a',
    APP: '//div[contains(@class, "c-keyword-wrap") and .//p[@class="h4" and text()="인기 검색어"]]//a',
  },

  // 검색 > 검색어 인풋
  searchInput: {
    PC: '.c-inpform input',
    MOBILE: '.c-inp',
    APP: '.c-inp',
  },

  // 검색 > 돋보기 버튼
  searchBtn: {
    PC: '.c-inpform .c-ibtn-find',
    MOBILE: '.c-btn-search',
    APP: '.c-btn-search',
  },

  // 검색결과 > 검색 탭(개인/기업)
  searchTab: {
    PC: '',
    MOBILE: '',
    APP: '.c-inpform.is-clear div.c-inpitem .c-inp',
  },

  // 검색결과 검색어
  searchTerm: {
    PC: '.search-result-tit .search-term',
    MOBILE: '',
    APP: 'strong.tit',
  },

  // 검색 페이지 > 인풋
  searchPageInput: {
    PC: '',
    MOBILE: '.c-inpform.is-clear div.c-inpitem .c-inp',
    APP: '',
  },

  // 검색 페이지 > 검색 결과 없는 경우 검색
  searchResult: {
    PC: '.no-result-tit',
    MOBILE: '.search-result .tit',
    APP: '//div[contains(@name, "app_faq")]',
  },

  // 검색버튼
  searchButton: {
    PC: '',
    MOBILE: '',
    APP: '//button[contains(@class, "c-ibtn-find")]',
  },

  // 검색 클리어 버튼
  searchClearButton: {
    PC: '',
    MOBILE: '',
    APP: 'div.modal-content button[title="입력한 문자 삭제"]',
  },

  // iosLocator
  searchModal: '//div[contains(@class, "modal-dialog") and contains(@class, "lay-search-area2")]',
  search_icon: 'button[data-gtm-click-text="검색"]',
  search_url: '/search',
  search_input: 'input[name="통합검색"]',
  search_clear: 'button[title="입력한 문자 삭제"]',
  search_HashTag_div: '.c-tag-wrap',
  resultInput: '.c-inp',
  resultBox: '.c-inpitem',
  resultSection: '.c-accordion-wrap',
  resultList: '.c-acc-tit',
  noneResultBox: '.search-result',
  BackBtn: '.c-btn-prev',
  hashTag: '.c-tag',
  search_text: ['테스트', '@#$@#$', '결과없음'],
  searchCon: 'strong[class="tit"]',
} as const;

// 전체 타입
export type UILocator = typeof searchLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
