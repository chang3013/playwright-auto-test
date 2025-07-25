import { UIType } from '@common/types/platform-types';

export const mypageLocator = {
  // 마이페이지 서브메인 > 청구서드랍다운
  myInfoDrop: {
    PC: '',
    MOBILE: '',
    APP: '.c-btn-dropdown',
  },

  netFlix: {
    PC: '',
    MOBILE: '',
    APP: 'a.c-btn-outline-2-s',
  },
  netFlixPage: {
    PC: '',
    MOBILE: '',
    APP: 'h1.header-title',
  },

  // 마이페이지 서브메인 > 청구 및 납부 정보
  myInfo: {
    PC: '.c-page-section:nth-of-type(1)',
    MOBILE: '',
    APP: '.bill-info > li.join-num:nth-of-type(1)',
  },

  myInfoBtn: {
    PC: '',
    MOBILE: '',
    APP: '//android.widget.Button[@text="전체메뉴 열기"]',
  },

  // 마이페이지 서브메인 > 청구 및 납부 정보 > '*월 청구요금'
  myInfoData: {
    PC: '.c-page-section:nth-of-type(1) .text-line-02',
    MOBILE: '',
    APP: 'div.info-desc .sum-amount',
  },

  // 마이페이지 서브메인 > 청구 및 납부 정보 > 청구요금
  myInfoCharge: {
    PC: '.c-page-section:nth-of-type(1) ul li:nth-of-type(3)',
    MOBILE: '.sum-amount',
    APP: '.sum-amount',
  },

  // 마이페이지 서브메인 > 청구 및 납부 정보 > 청구서 더보기 버튼
  myInfoMoreBtn: {
    PC: '.c-page-section:nth-of-type(1) .top-area button',
    MOBILE: '.c-btn-dropdown',
    APP: 'div.c-noticebox-5 > button',
  },
  iosInfoMoreBtn: '.c-btn-dropdown',
  // 마이페이지 서브메인 > 청구 및 납부 정보 > 청구서 더보기 > 청구요금
  moreInfoCharge: {
    PC: 'table tbody tr:nth-of-type(1) .flex-c div:nth-of-type(3)',
    MOBILE: '.modal-content .c-radio-group-3 > div:nth-of-type(1) .charge',
    APP: 'div.radio-info > ul.bill-info > li.charge',
  },
  iosMoreInfoCharge: '.modal-content .c-radio-group-3 > div:nth-of-type(1) .charge',
  // 마이페이지 > 요금/납부 & 사용내역 조회 > 타이틀
  myPageTitle: {
    PC: '.c-title-section',
    MOBILE: '',
    APP: 'h2.header-title',
  },

  // 마이페이지 > 요금/납부 > 청구서 받는 방법
  myBillData: {
    PC: '.middle-area > div:nth-of-type(1) tr:nth-of-type(3) td',
    MOBILE: '',
    APP: '',
  },

  // 마이페이지 > 요금/납부 정보
  myBillInfo: {
    PC: '.c-page-section:nth-of-type(1)',
    MOBILE: '',
    APP: 'ul.list-box-flexfull.overline-0 >li > span',
  },

  // 마이페이지 > 요금/납부 > 탭
  myBillTab: {
    PC: '.c-page-section:nth-of-type(1) .bottom-area',
    MOBILE: '',
    APP: '',
  },

  // 마이페이지 > 요금/납부 > 탭 리스트
  myBillTabList: {
    PC: '.c-page-section:nth-of-type(1) .bottom-area button',
    MOBILE: '',
    APP: '',
  },

  // 마이페이지 > 요금/납부 > 청구내역 > 타이틀
  chargeTitle: {
    PC: '.c-page-section:nth-of-type(2) h3',
    MOBILE: 'ul[role="tablist"] li:nth-of-type(1) span',
    APP: 'a[role="tab"][aria-selected="true"] > span',
  },

  // 마이페이지 > 요금/납부 > 청구내역 리스트
  chargeList: {
    PC: '.c-page-section:nth-of-type(2)',
    MOBILE: '',
    APP: '.info-desc-txt charge-info',
  },

  // 마이페이지 > 요금/납부 > 청구내역 > 청구월
  chargeMonth: {
    PC: '.c-page-section:nth-of-type(2) .c-table tbody a:nth-of-type(1)',
    MOBILE: '.tab-panel li button',
    APP: 'li.line-item > span',
  },

  // 마이페이지 > 요금/납부 > 청구내역 > 청구금액
  chargeAmount: {
    PC: '.c-page-section:nth-of-type(2) .c-table tbody td:nth-of-type(2)',
    MOBILE: '.tab-panel li strong',
    APP: 'li.line-item > p',
  },
  iosChargeAmount: '.tab-panel li strong',
  // 마이페이지 > 요금/납부 > 납부내역 > 타이틀
  paymentTitle: {
    PC: '.c-page-section:nth-of-type(3) h3',
    MOBILE: 'ul[role="tablist"] li:nth-of-type(2) span',
    APP: 'a[role="tab"][aria-selected="false"] > span',
  },
  iosPaymentTitle: 'ul[role="tablist"] li:nth-of-type(2) span',
  // 마이페이지 > 요금/납부 > 납부내역 리스트
  paymentList: {
    PC: '.c-page-section:nth-of-type(3)',
    MOBILE: '',
    APP: '',
  },

  // 마이페이지 > 요금/납부 > 납부내역 > 납부일
  paymentDate: {
    PC: '.c-page-section:nth-of-type(3) .c-table tbody td:nth-of-type(1)',
    MOBILE: '.tab-panel li i',
    APP: 'li.line-item >span > i ',
  },

  // 마이페이지 > 요금/납부 > 납부내역 > 납부금액
  paymentAmount: {
    PC: '.c-page-section:nth-of-type(3) .c-table tbody td:nth-of-type(3)',
    MOBILE: '.tab-panel li strong',
    APP: 'li.line-item > p >strong',
  },
  iosPaymentAmount: '.tab-panel li strong',
  // 마이페이지 > 가입/사용 현황 > 사용내역 조회
  useData: {
    PC: '.c-custom-tb tbody',
    MOBILE: '',
    APP: '',
  },

  // 마이페이지 > 가입/사용 현황 > 사용내역 조회 > 탭
  useTab: {
    PC: '.swiper-wrapper',
    MOBILE: '.swiper-wrapper',
    APP: 'div.swiper-container.is-start > ul[role="tablist"] > li',
  },
  iosuseTab: '.swiper-wrapper',
  // 마이페이지 > 가입/사용 현황 > 사용내역 조회 > 실시간 요금 조회 > 요금
  useCharge: {
    PC: '.c-page-section:nth-of-type(1) strong',
    MOBILE: '.info-title em',
    APP: 'p.info-title > em',
  },
  iosUseCharge: '.info-title em',
  // 마이페이지 > 가입/사용 현황 > 사용내역 조회 > 실시간 요금 조회 > 요금 합계
  useTotalCharge: {
    PC: '.c-page-section:nth-of-type(1) tfoot .c-cell-right',
    MOBILE: '.list-box-usedinfo > li:last-child li p',
    APP: 'ul.item-tit > li> p',
  },
  iosUseTotalCharge: '.list-box-usedinfo > li:last-child li p',
  // 마이페이지 > 가입/사용 현황 > 사용내역 조회 > 탭 > 월별 사용량 조회
  useMonthTab: {
    PC: '.swiper-wrapper li:nth-of-type(2) a',
    MOBILE: '.swiper-wrapper li:nth-of-type(2) a',
    APP: '.swiper-slide.swiper-slide-next',
  },
  iosUseMonthTab: '.swiper-wrapper li:nth-of-type(2) a',
  // 마이페이지 > 가입/사용 현황 > 사용내역 조회 > 탭 > 월별 사용량 조회 > 월별 사용량 상세 조회
  monthDetailBtn: {
    PC: '.c-content-wrap .c-btn-group button',
    MOBILE: '.c-btn-group button',
    APP: 'button.c-btn-outline-2-m',
  },
  iosMonthDetailBtn: '.c-btn-group button',
  // 마이페이지 > 가입/사용 현황 > 사용내역 조회 > 탭 > 월별 사용량 조회 > 월별 사용량 상세 조회 > 탭
  monthDetailTab: {
    PC: '.c-page-section .c-tabmenu-tab',
    MOBILE: '.modal-content .swiper-wrapper',
    APP: 'div.swiper-container.is-start > ul > li > a >span',
  },
  iosMonthDetailTab: '.modal-content .swiper-wrapper',
  // 마이페이지 > 가입/사용 현황 > 사용내역 조회 > 탭 > 통화상세내역
  callDetailTab: {
    PC: '.swiper-wrapper li:nth-of-type(3) a',
    MOBILE: '.swiper-wrapper li:nth-of-type(3) a',
    APP: 'li#TAB3.swiper-slide > a[role="tab"][aria-selected="false"] > span',
  },
  iosCallDetailTab: '.swiper-wrapper li:nth-of-type(3) a',
  // 마이페이지 > 가입/사용 현황 > 사용내역 조회 > 탭 > 통화상세내역 정보
  callDetailInfo: {
    PC: '.bd-tb-wrap',
    MOBILE: '.tab-panel .c-section-md',
    APP: 'label.c-label[for="username-1-1"]',
  },
  callDetailInfo2: {
    PC: '',
    MOBILE: '',
    APP: 'label[for="rParamsType1"] > span',
  },

  // 마이페이지 > 가입/사용 현황 > 사용내역 조회 > 탭 > 통화상세내역 > 조회 버튼
  callDetailBtn: {
    PC: '.in-btn-group button',
    MOBILE: '.c-btn-group a',
    APP: 'a.c-btn-solid-1-m',
  },
  iosCallDetailBtn: '.c-btn-group a',
  callDetailBtn2: {
    PC: '',
    MOBILE: '',
    APP: 'button.c-btn-solidbox-1',
  },
  //모달 텍스트 비교를 위한 셀렉터
  callDetailModal: '.section-caution .c-btn-group',

  //마이페이지 서브메인
  myGnb: 'button[data-gtm-click-text="마이페이지"]',
  mySubMainBtn: 'a[data-gtm-click-text="마이페이지"]',
  myPageURL: '/mypage',

  myPageDropdown: '.c-btn-dropdown',
  myPageBillModal: '.modal-content',
  myPageDropList: '.modal-content div.c-radio-box-3 li.service-type',
  myPageDropRadio: 'input[type="radio"]',
  myPageDropSubmit: 'footer > div > button',

  myPageDataUsed: 'li.used-data > div',
  myPageBillInfo: 'li.charged > div',
  myPageOrderInfo: '//div[contains(.,"주문정보") and contains(@class,"c-section")]',
  myPageJoinService: '//div[contains(.,"가입 서비스") and contains(@class,"c-section")]',

  // 마이페이지 > 요금/납부 > 요금/납부 조회
  myPageBill: 'a[data-gtm-click-text="마이페이지|요금/납부"]',
  myPageBillDirect: '//a[contains(.,"요금/납부 조회")]',
  myPageMobileBill: 'a[role="button"]',
  myPagePaymentInfo: 'div.info-box',
  myPagePayBillTab: 'div.m-tabs a[role="tab"]',
  myPagePayBillList: 'div.tab-panel li.line-item',

  //마이페이지 > 가입/사용 현황 > 사용내역 조회
  myPageUsedMenu: 'a[data-gtm-event-label="컨텐츠 : 마이페이지|가입/사용 현황"]',
  myPageUseHistory: '//a[contains(.,"사용내역 조회")]',
  myPageRealBill: 'ul[role="tablist"]>li:nth-of-type(1)>a',
  myPageRealBillInfo: '.p-mypage > div > div:nth-of-type(1) > div > p:nth-of-type(1) > em',
  myPageRealBillSum: '.list-box-usedinfo > li:nth-of-type(3) > ul > li > p',
  myPageMonthlyTab: 'ul[role="tablist"]>li:nth-of-type(2)>a',
  myPagePrevMonthly: 'button.c-btn-month-prev',
  myPageMonthlyCheckBtn: 'div.c-section-md >div.c-btn-group >button',
  myPageMonthlyCheckEl: 'div.modal-content span.monthly',
  myPageMonthlySubmitBtn: 'div.modal-content div.c-btn-group>button',
  myPageCallInfoList: 'ul[role="tablist"]>li:nth-of-type(3)>a',

  //ios 마이페이지 케이스 정리
  usedPlanName: '.used-data .info-desc:first-child dt',
  monthCharged: '.charged .sum-amount',
  paymentMenu: 'a[data-gtm-click-text="마이페이지|요금/납부"]',
  paymentJoin: 'a[data-gtm-click-text="마이페이지|요금/납부|요금/납부 조회"]',
  billPageBtn: '.c-goto-block a',
  listBox: '.c-list-box-line',
  moreBtn: '.c-btn-group',
} as const;

// 전체 타입
export type UILocator = typeof mypageLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
