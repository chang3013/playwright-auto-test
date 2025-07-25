import { UIType } from '@common/types/platform-types';

// 웹/모바일 메뉴 탭 라벨
export const MenuTabLabel = {
  MOBILE: '모바일',
  INTERNET: '인터넷/IPTV',
  MYPAGE: '마이페이지',
  BENEFIT: '혜택/멤버십',
  SUPPORT: '고객지원',
  DIRECT: '다이렉트샵',
  ROAMING: '해외로밍', // 모바일만
  UDOC: '유독',
} as const;

export type MenuTabLabel = (typeof MenuTabLabel)[keyof typeof MenuTabLabel];

// 웹 헤드메뉴 라벨
export const WebHeadMenuLabel = {
  HAMBURGER: '전체메뉴',
  STORE: '스토어 가이드',
  SEARCH: '검색',
  CART: '장바구니',
  MYINFO: '내정보 메뉴 펼치기',
} as const;

export type WebHeadMenuLabel = (typeof WebHeadMenuLabel)[keyof typeof WebHeadMenuLabel];

/**
 * UI 관련 로케이터
 */
export const uiLocator = {
  // 헤더 로고
  logo: {
    PC: '//a[normalize-space(text())="LG U+"]',
    MOBILE: '//a[span[contains(@class, "is-blind") and normalize-space(text())="LG U+"]]',
    APP: '',
  },

  // 햄버거
  hamburger: {
    PC: '//a[img[@alt="전체메뉴"]]',
    MOBILE: '//button[.//span[contains(text(), "전체메뉴")]]',
    APP: '//button[.//span[contains(text(), "전체메뉴 열기")]]',
  },

  // (Web) GNB 스토어 가이드
  storeGuideIcon: {
    PC: '//a[img[@alt="스토어 가이드"]]',
    MOBILE: '',
    APP: '',
  },

  // GNB 서치
  searchGNB: {
    PC: '//a[img[@alt="검색"]]',
    MOBILE: '//button[span[contains(@class, "is-blind") and normalize-space(text())="검색하기"]]',
    APP: '.header-utill button.c-btn-search',
  },

  // GNB 장바구니
  cartGNB: {
    PC: '//a[img[@alt="장바구니"]]',
    MOBILE: '//button[span[contains(@class, "is-blind") and normalize-space(text())="장바구니"]]',
    APP: '',
  },

  // (Web) GNB 나의 정보
  myInfoIcon: {
    PC: '//a[span[contains(@class, "is-blind") and normalize-space(text())="내정보 메뉴 펼치기"]]',
    MOBILE: '',
    APP: '',
  },

  // (Mobile) 햄버거 > 메인 바로가기
  homeShortcutGNB: {
    PC: '',
    MOBILE:
      '//button[span[contains(@class, "is-blind") and normalize-space(text())="홈 바로가기"]]',
    APP: '//button[span[contains(@class, "is-blind") and normalize-space(text())="홈 바로가기"]]',
  },

  // (Mobile) 햄버거 > Global 바로가기
  globalShortcutGNB: {
    PC: '',
    MOBILE:
      '//button[span[contains(@class, "is-blind") and normalize-space(text())="글로벌 바로가기"]]',
    APP: '',
  },

  // GNB 모바일
  mobileMenu: {
    PC: '.header-gnb-area .m1 > a',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "모바일")]',
    APP: '//button[contains(.,"모바일")]',
  },

  // GNB, 햄버거 > 모바일 > 휴대폰 기기 > 휴대폰
  mobilePhone: {
    PC: '.header-gnb-area .m1 div > ul > li:nth-of-type(1) li:nth-of-type(1) a',
    MOBILE: '.menu > ul > li > ul > li:nth-of-type(1) li:nth-of-type(1)',
    APP: '',
  },

  // GNB, 햄버거 > 모바일 > 모바일 요금제 > 5G/LTE
  mobilePlan: {
    PC: '.header-gnb-area .m1 div > ul > li:nth-of-type(2) li:nth-of-type(1) a',
    MOBILE: '.menu > ul > li > ul > li:nth-of-type(2) li:nth-of-type(1)',
    APP: '',
  },

  // GNB, 햄버거 > 인터넷/IPTV
  internetMenu: {
    PC: '.header-gnb-area .m2 > a',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "인터넷")]',
    APP: '',
  },

  // GNB, 햄버거 > 마이페이지
  mypageMenu: {
    PC: '.header-gnb-area .m3 > a',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "마이페이지")]',
    APP: '//span[contains(text(),"마이페이지")]',
  },

  // GNB, 햄버거 > 마이페이지 상단
  mypageMenuIn: {
    PC: '',
    MOBILE: '',
    APP: '(//img[@alt="마이페이지"])[1]',
  },

  // GNB, 햄버거 > 마이페이지 > 요금/납부
  mypageBill: {
    PC: '.header-gnb-area .m3 div > ul > li:nth-of-type(1) a',
    MOBILE: '.menu > ul > li > ul > li:nth-of-type(2)',
    APP: '',
  },

  // GNB, 햄버거 > 마이페이지 > 사용내역 조회
  mypageUse: {
    PC: '.header-gnb-area .m3 div > ul > li:nth-of-type(2) li:nth-of-type(4) a',
    MOBILE: '.menu > ul > li > ul > li:nth-of-type(3) li:nth-of-type(6)',
    APP: '',
  },

  // GNB, 햄버거 > 혜택/멤버십
  benefitMenu: {
    PC: '.header-gnb-area .m4 > a',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "혜택/멤버십")]',
    APP: '//button[contains(.,"혜택/멤버십")]',
  },

  // GNB, 햄버거 > 혜택/멤버십 > 멤버십 > 멤버십 이용내역
  membership: {
    PC: '.header-gnb-area .m4 div > ul > li:nth-of-type(1) li:nth-of-type(5) a',
    MOBILE: '.menu > ul > li > ul > li:nth-of-type(2) li:nth-of-type(5)',
    APP: '',
  },

  // GNB > 혜택/멤버십 > 서비스+ > 유잼
  ujam: {
    PC: '.header-gnb-area .m4 div > ul > li:nth-of-type(7) li:nth-of-type(1) a',
    MOBILE: '.menu > ul > li > ul > li:nth-of-type(9) li:nth-of-type(1)',
    APP: '',
  },

  // 햄버거 > 혜택/멤버십 > 서비스+ > 유잼
  ujamHBG: {
    PC: '.menu-section-4 > ul > li:nth-of-type(7) li:nth-of-type(1)',
    MOBILE: '',
    APP: 'a[data-gtm-click-text="혜택/멤버십|서비스+|유잼"]',
  },

  // GNB, 햄버거 > 고객지원
  supportMenu: {
    PC: '.header-gnb-area .m5 > a',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "고객지원")]',
    APP: '',
  },

  // GNB, 햄버거 > 너겟
  nurgetMenu: {
    PC: '.header-gnb-area .m6 > a',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "너겟")]',
    APP: '',
  },

  // GNB, 햄버거 > 유독
  udocMenu: {
    PC: '.header-gnb-area .m7 > a',
    MOBILE: '//li[button/span and contains(normalize-space(button/span/text()), "유독")]',
    APP: '//button[contains(.,"유독")]',
  },

  // 전체 서브메뉴 펼침 버튼
  expandAllButton: {
    PC: '',
    MOBILE: '//button[@class="dep_all" and contains(text(), "전체 펼침")]',
    APP: 'button.dep_all',
  },

  // 뒤로가기 버튼
  backButton: {
    PC: '',
    MOBILE: '//button[@class="history_back" and span[text()="뒤로가기"]]',
    APP: 'button.c-btn-prev',
  },

  // 서브메인 진입 버튼
  subMainBtn: {
    PC: '',
    MOBILE: '.menu > ul > li > div a',
    APP: '',
  },

  // 공통 부분은 json 처럼 기재하면 됨
  // 전역적인 오버레이
  body: "html[lang='ko']>body",
  // 페이지 푸터
  footer: 'body footer',
  // 전체 모달 컨텐츠
  modalContent: 'div.modal-content',
  // 모달 헤더 정보
  modalHeader: 'header.modal-header h1',
  // 모달 바디
  modalBody: 'div.modal-body',
  // 모달 헤더 닫기 버튼
  modalHeaderClose: 'header.modal-header button.c-btn-close',
  // 모달 푸터
  modalFooter: 'div.modal-content footer',
  // 모달 푸터 확인 버튼
  modalConfirm:
    "//div[contains(@class, 'modal-content')]//footer//button[contains(text(), '확인')]",
  // 모달 푸터 오늘 하루 그만 보기 체크
  modalTodayOnlyOnceCheck:
    "//span[contains(@class, 'txt') and contains(text(), '오늘 하루 그만 보기')]",
  // 모달 푸터 오늘 하루 그만 보기 버튼
  modalTodayOnlyOnceButton:
    "//div[contains(@class, 'modal-content')]//footer//button[contains(text(), '오늘 하루 보지 않기')]",
  // 모달 푸터 닫기 버튼
  modalFooterClose:
    "//div[contains(@class, 'modal-content')]//footer//button[contains(text(), '닫기')]",
  // 인터스티셜 오버레이
  insOverlay: "//div[contains(@class, 'ins-custom-overlay')]",
  // 인터스티셜 창
  insWrapper: "//div[contains(@class, 'ins-custom-wrapper')]",
  // 인터스티셜 창2
  insToast: "//div[contains(@class, 'ins-toast')]",
  // 인터스티셜 창3
  insPopup: "//div[contains(@class, 'ins-popup')]",
  // 인터스티셜 창4
  insContent: "//div[contains(@class, 'ins-content')]",
  // 인터스티셜 닫기버튼
  insCloseButton: "//div[contains(@class, 'ins-close-button') and text()='닫기']",
  // 인터스티셜 닫기버튼2
  insCloseButton2: "//div[contains(@class, 'ins-element-close-button')]",
  // 인터스티셜 닫기버튼3
  insCloseButton3: "//div[contains(@class, 'ins') and contains(text(), '닫기')]",

  modal_selector: [
    'c-btn-close',
    '.c-btn-rect-3',
    '.c-btn-rect-4',
    '//button[contains(text(), "닫기")]',
    'div[data-action="close"]',
    '.ins-element-close-button',
    '.btn-close',
  ],

  //모달 확인버튼
  insButton: '//button[text()="확인"]',
  insCloseButton4: '.c-btn-box-1',
  insCloseButton5: '.c-btn-solidbox-1',

  modalCloseButtonList: [
    'header.modal-header button.c-btn-close',
    "//div[contains(@class, 'modal-content')]//footer//button[contains(text(), '닫기')]",
    "//div[contains(@class, 'ins-close-button') and text()='닫기']",
    "//div[contains(@class, 'ins-element-close-button')]",
    "//div[contains(@class, 'ins') and contains(text(), '닫기')]",
  ],

} as const;

// 전체 타입
export type UILocator = typeof uiLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
