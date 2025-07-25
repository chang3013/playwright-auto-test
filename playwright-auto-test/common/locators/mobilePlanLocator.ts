import { UIType } from '@common/types/platform-types';

export const mobilePlanLocator = {
  /** 모바일 요금제 */
  // 모바일 > 모바일 요금제 > 5G/LTE > 내 요금제 정보
  myInfo: {
    PC: '.key-area',
    MOBILE: '',
    APP: '.c-accordion-header.collapsed i.ico-toggle.when-open',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 내 요금제 정보 드롭다운
  myInfoDropDown: {
    PC: '',
    MOBILE: '.tab-panel .accordion:nth-of-type(1)',
    APP: '.c-accordion-group > div > p',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 내 요금제 이름
  myPlanName: {
    PC: '.key-area dl div:nth-of-type(1) dd',
    MOBILE: '.tab-panel .accordion:nth-of-type(1) .c-acc-price em',
    APP: '.tab-panel .accordion:nth-of-type(1) .c-acc-price em',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 내 요금제 월정액
  myPlanPrice: {
    PC: '.key-area strong',
    MOBILE: '.tab-panel .accordion:nth-of-type(1) ul li:nth-of-type(1) p',
    APP: '.tab-panel .accordion:nth-of-type(1) ul li:nth-of-type(1) p',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 탭 리스트
  tabList: {
    PC: '.c-tabmenu-wrap ul[role="tablist"]',
    MOBILE: '.c-tabmenu-wrap ul[role="tablist"]',
    APP: '.c-tabmenu-wrap ul[role="tablist"]',
  },
  iosTabList: '.c-tabmenu-wrap ul[role="tablist"]',

  // 모바일 > 모바일 요금제 > 5G/LTE > 탭 리스트
  tabList1: {
    PC: '',
    MOBILE: '',
    APP: 'a[data-gtm-click-text="5G/LTE"]',
  },
  tabList2: {
    PC: '',
    MOBILE: '',
    APP: 'a[data-gtm-click-text="온라인 전용 요금제"]',
  },
  tabList3: {
    PC: '',
    MOBILE: '',
    APP: 'a[data-gtm-click-text="태블릿/스마트워치"]',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 탭 리스트 > 링크
  tabListLink: {
    PC: '.c-tabmenu-wrap ul[role="tablist"] a',
    MOBILE: '.c-tabmenu-wrap ul[role="tablist"] a',
    APP: '.c-tabmenu-wrap ul[role="tablist"] a',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 요금제 리스트
  planList: {
    PC: '.plan-list',
    MOBILE: '.plan_inner_pad1',
    APP: '.plan_inner_pad1',
  },
  planListClass: '.rbox_wrap1',

  // 모바일 > 모바일 요금제 > 5G/LTE > 요금제 이름
  planName: {
    PC: '.plan-list li .btn-plan',
    MOBILE: '.plan_inner_pad1 .rbox_wrap1 .tit1',
    APP: '.plan_inner_pad1 .rbox_wrap1 .tit1',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 요금제 가격
  planPrice: {
    PC: '.plan-list li .price',
    MOBILE: '.plan_inner_pad1 .rbox_wrap1 .txt_price1 strong',
    APP: '.plan_inner_pad1 .rbox_wrap1 .txt_price1 strong',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 요금제 변경하기 버튼
  planChangeBtn: {
    PC: '.plan-list li .btn-apply',
    MOBILE: '.plan_inner_pad1 .rbox_wrap1 .c-btn-group button:nth-of-type(2)',
    APP: '.plan_inner_pad1 .rbox_wrap1 .c-btn-group button:nth-of-type(2)',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 요금제 비교하기 버튼
  planCompareBtn: {
    PC: '.plan-list li .btn-compare',
    MOBILE: '.plan_inner_pad1 .rbox_wrap1 .c-btn-group button:nth-of-type(1)',
    APP: '.plan_inner_pad1 .rbox_wrap1 .c-btn-group button:nth-of-type(1)',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 비교하기 > 비교함 버튼
  movePlanCompareBtn: {
    PC: '.modal-footer button',
    MOBILE: '',
    APP: '',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 비교하기 > 요금제명
  comparePagePlanName: {
    PC: '.compare-head .plan-name',
    MOBILE: '.cont strong',
    APP: '.cont strong',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 비교하기 > 요금제 가격
  comparePagePlanPrice: {
    PC: '.plan-detail-section .price strong',
    MOBILE: '.plan_inner_pad1 > .list_wrap4:nth-of-type(1) strong',
    APP: '.plan_inner_pad1 > .list_wrap4:nth-of-type(1) strong',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 변경하기 > 혜택 모달 > 타이틀
  benefitTitle: {
    PC: '',
    MOBILE: '.modal-content .title .txt',
    APP: '.modal-content .title .txt',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 변경하기 > 혜택 모달 > 혜택 리스트
  benefitList: {
    PC: '.modal-body .c-radio',
    MOBILE: '.modal-content .c-card-radio-1',
    APP: '.modal-content .c-card-radio-1',
  },
  firstBenefit: '.modal-content .c-card-list li:nth-child(4) label',
  secondBenefit: '.modal-content .c-card-list li:nth-child(1) label',
  // 모바일 > 모바일 요금제 > 5G/LTE > 변경하기 > 혜택 모달 > 다음 버튼
  benefitNextBtn: {
    PC: '.modal-footer .btn-next',
    MOBILE: '.modal-footer button',
    APP: '.modal-footer button',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 변경하기 > 요금제 변경 내역 > 요금제명
  planNameRow: {
    PC: '.p-main-sub-my-section > div:nth-of-type(3) tbody tr:first-child',
    MOBILE: '.submain-section .row:nth-of-type(1) tbody tr:first-child',
    APP: '.submain-section .row:nth-of-type(1) tbody tr:first-child',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 변경하기 > 요금제 변경 내역 > 현재 월정액
  nowPrice: {
    PC: '.p-main-sub-my-section > div:nth-of-type(3) tbody tr:last-child .tb-point-b',
    MOBILE: '.submain-section .row:nth-of-type(1) tbody tr:last-child .tb-point-b',
    APP: '.submain-section .row:nth-of-type(1) tbody tr:last-child .tb-point-b',
  },

  // 모바일 > 모바일 요금제 > 5G/LTE > 변경하기 > 요금제 변경 내역 > 변경 월정액
  changePrice: {
    PC: '.p-main-sub-my-section > div:nth-of-type(3) tbody tr:last-child .cl-def',
    MOBILE: '.submain-section .row:nth-of-type(1) tbody tr:last-child .color-def',
    APP: '.submain-section .row:nth-of-type(1) tbody tr:last-child .color-def',
  },
  mobileGnb: 'button[data-gtm-click-text="모바일"]',
  mobilePlan: 'a[data-gtm-click-text="모바일|모바일 요금제"]',
  mobile5G_LTE: 'a[data-gtm-click-text="모바일|모바일 요금제|5G/LTE"]',
  backBtn: '.c-btn-prev',
  compareUrl: '/compare',
} as const;

// 전체 타입
export type UILocator = typeof mobilePlanLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
